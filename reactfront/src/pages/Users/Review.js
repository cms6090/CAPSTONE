import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Review.css';
import { Button2, Button5 } from '../../components/Button.style';
import Rating from '@mui/material/Rating';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import IconButton from '@mui/material/IconButton';

export default function Review() {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [error, setError] = useState(null);
  const [images, setImages] = useState([]);
  const [existingReview, setExistingReview] = useState(null);
  const [reservePhoto, setReservePhoto] = useState(null);
  const [deletedImages, setDeletedImages] = useState([]);
  const [isPast, setIsPast] = useState(false); // Corrected initialization

  const navigate = useNavigate();
  const { state } = useLocation();
  const reservation = state?.reservation;

  // 리뷰 정보 가져오기 (특정 예약 ID로)
  useEffect(() => {
    if (state?.isPast) {
      setIsPast(state.isPast);
    }
  }, [state?.isPast]); // Set `isPast` only once when the component mounts

  // 리뷰 정보 가져오기 (특정 예약 ID로)
  useEffect(() => {
    const fetchReview = async () => {
      try {
        if (!reservation) return;
        const token = sessionStorage.getItem('accessToken');
        if (!token) {
          setError('로그인이 필요합니다.');
          return;
        }
        const response = await fetch(
          `http://localhost:3000/api/reviews/get/${reservation.reservation_id}`,
          { method: 'GET', headers: { Authorization: `Bearer ${token}` } },
        );
        if (response.ok) {
          const data = await response.json();
          if (data && data.review) {
            setExistingReview(data.review);
            setRating(data.review.rating);
            setReviewText(data.review.comment);
            setReservePhoto(data.review.review_photos[0]?.review_photos_id);

            // 추가적으로 이미지를 불러오는 로직
            if (data.review.review_photos) {
              const photos = [
                data.review.review_photos[0]?.review_photos_1,
                data.review.review_photos[0]?.review_photos_2,
                data.review.review_photos[0]?.review_photos_3,
                data.review.review_photos[0]?.review_photos_4,
                data.review.review_photos[0]?.review_photos_5,
              ]
                .filter((photo) => photo !== null)
                .map((photo) => ({
                  preview: `http://localhost:3000/uploads/${photo}`, // This should match the server path
                }));
              setImages(photos);
            }
          } else {
            setExistingReview(null); // 리뷰가 없을 경우 null로 설정
          }
        } else if (response.status === 404) {
          setExistingReview(null); // 리뷰를 찾을 수 없을 경우 null로 설정 (에러로 처리하지 않음)
        }
      } catch (err) {
        console.info('리뷰가 존재하지 않습니다.'); // 리뷰가 없는 경우 정보 로그로 출력
      }
    };

    if (isPast) {
      fetchReview();
    }
  }, [reservation, isPast]);

  // 리뷰 제출 처리 함수
  const handleSubmit = async () => {
    if (!rating) return setError('별점을 선택해주세요.');
    if (images.length > 5) return setError('이미지는 최대 5개까지 업로드할 수 있습니다.');

    try {
      const token = sessionStorage.getItem('accessToken');
      if (!token) return setError('로그인이 필요합니다.');

      // Create FormData to send images and review data
      const formData = new FormData();
      formData.append('reservationId', reservation?.reservation_id);
      formData.append('rating', rating);
      formData.append('comment', reviewText);
      formData.append('lodgingId', parseInt(reservation?.rooms?.lodgings?.lodging_id, 10));

      // Add new and existing images to FormData
      for (const image of images) {
        if (image.file) {
          formData.append('photos', image.file);
        } else if (
          typeof image.preview === 'string' &&
          image.preview.startsWith('http://localhost:3000/uploads/')
        ) {
          const response = await fetch(image.preview);
          if (response.ok) {
            const blob = await response.blob();
            const fileName = image.preview.split('/').pop();
            const file = new File([blob], fileName, { type: blob.type });
            formData.append('photos', file);
          }
        }
      }

      // Add deleted images to FormData
      if (deletedImages.length > 0) {
        formData.append('deletedPhotos', JSON.stringify(deletedImages));
      }

      // Submit review (create or update)
      const response =
        existingReview &&
        typeof existingReview.review_id === 'number' &&
        existingReview.review_id > 0
          ? await fetch(
              `http://localhost:3000/api/reviews/put/${existingReview.review_id}/${reservePhoto}`,
              {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
              },
            )
          : await fetch('http://localhost:3000/api/reviews', {
              method: 'POST',
              headers: { Authorization: `Bearer ${token}` },
              body: formData,
            });

      if (!response.ok) throw new Error('리뷰 제출에 실패했습니다. 다시 시도해주세요.');

      alert('리뷰가 성공적으로 제출되었습니다.');
      navigate('/profile/reservations');
    } catch (err) {
      setError(err.message);
    }
  };

  // 이미지 선택 처리 함수
  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);

    if (images.length + files.length > 5) {
      return setError('이미지는 최대 5개까지 업로드할 수 있습니다.');
    }

    const updatedFiles = files.map((file) => {
      file.preview = URL.createObjectURL(file);
      return { file, preview: file.preview };
    });

    setImages((prevImages) => [...prevImages, ...updatedFiles]);
  };

  // 이미지 삭제 처리 함수
  const handleImageDelete = (index) => {
    setImages((prevImages) => {
      const imageToDelete = prevImages[index];
      if (
        !imageToDelete.file &&
        imageToDelete.preview.startsWith('http://localhost:3000/uploads/')
      ) {
        // Add the deleted image path to deletedImages list if it's an existing image
        setDeletedImages((prevDeleted) => [...prevDeleted, imageToDelete.preview.split('/').pop()]);
      }

      URL.revokeObjectURL(imageToDelete.preview);
      return prevImages.filter((_, i) => i !== index);
    });
  };

  return (
    <div className="review-page">
      <div className="review-container">
        {reservation && (
          <div className="review-lodging-info-container">
            <div className="review-img">
              <img src={reservation.rooms.lodgings.main_image} alt="Lodging" />
            </div>
            <div className="review-lodging-info-texts">
              <div style={{ fontSize: '1.3em' }}>{reservation.rooms.lodgings.name}</div>
              <div style={{ fontSize: '1em' }}>{reservation.rooms.room_name}</div>
              <div className="review-lodging-schedule">
                <div className="review-lodging-schedule-header">
                  <div>체크인</div>
                  <div>체크아웃</div>
                </div>
                <div style={{ marginLeft: '1em' }}>
                  <div>{new Date(reservation.check_in_date).toLocaleDateString()} 14:00</div>
                  <div>{new Date(reservation.check_out_date).toLocaleDateString()} 10:00</div>
                </div>{' '}
              </div>{' '}
            </div>{' '}
          </div>
        )}
        <div className="rating-container">
          {existingReview && (
            <div className="existing-review-message" style={{ color: 'red' }}>
              기존에 작성된 리뷰를 수정하고 있습니다.{' '}
            </div>
          )}
          <div>별점을 선택해주세요 :</div>
          <Rating
            name="simple-controlled"
            value={rating}
            onChange={(event, newValue) => setRating(newValue)}
          />
          <div className="review-text-container">
            <div>리뷰 내용을 작성해주세요 :</div>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="review-text-input"
              rows="5"
              placeholder="여기에 리뷰를 작성해주세요..."
            ></textarea>
          </div>
          <div className="review-image-container">
            이미지 첨부 :
            <span className="image-upload-container">
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="upload-button-file"
                type="file"
                multiple
                onChange={handleImageChange}
              />
              <label htmlFor="upload-button-file">
                <IconButton color="primary" aria-label="upload picture" component="span">
                  <ImageOutlinedIcon />
                </IconButton>
              </label>
              <div className="image-preview-container">
                {images.map((image, index) => (
                  <div key={index} className="image-preview-wrapper">
                    <img src={image.preview} alt="review" className="image-preview" />
                    <button
                      className="delete-image-button"
                      onClick={() => handleImageDelete(index)}
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </span>
          </div>
          {error && <div className="error-message">{error}</div>}
          <div className="review-actions">
            <Button2 onClick={handleSubmit}>리뷰 제출</Button2>
            <Button5
              onClick={() => navigate('/profile/reservations')}
              style={{ marginLeft: '1em', height: '100%' }}
            >
              취소
            </Button5>
          </div>
        </div>
      </div>
    </div>
  );
}
