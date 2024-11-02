// components/ReviewList.js
import StarRating from './StarRating';
import React, { useState } from 'react';
import './ReviewList.css';

export default function ReviewList({ reviews = [] }) {
  const defaultImage = 'https://via.placeholder.com/80'; // 기본 이미지 URL
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [expandedComments, setExpandedComments] = useState({});

  // 모달 열기 함수
  const openModal = (src) => {
    setModalImage(src);
    setModalOpen(true);
  };

  // 모달 닫기 함수
  const closeModal = () => {
    setModalOpen(false);
    setModalImage(null);
  };
  // 특정 리뷰의 댓글 확장 상태를 토글하는 함수
  const toggleExpand = (reviewId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  return (
    <div className="review-list">
      {reviews.length === 0 ? (
        <p>아직 리뷰가 없습니다.</p>
      ) : (
        reviews.map((review) => (
          <div key={review.review_id} className="review-item">
            {/* 리뷰 헤더 */}
            <div className="review-header">
              <div className="review-author">
                <div>
                  <strong>{review.users?.user_name || '익명 사용자'}</strong>
                  <div className="review-date">
                    {new Date(review.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <StarRating rating={review.rating} />
            </div>

            {/* 리뷰 사진 */}
            <div className="review-photos">
              {review.review_photos && review.review_photos.length > 0
                ? review.review_photos.map((photo, index) => {
                    const photosArray = [
                      photo.review_photos_1,
                      photo.review_photos_2,
                      photo.review_photos_3,
                      photo.review_photos_4,
                      photo.review_photos_5,
                    ].filter(Boolean); // 값이 존재하는 것만 필터링

                    return photosArray.map((src, idx) => (
                      <img
                        key={`${index}-${idx}`}
                        src={src || defaultImage}
                        alt={`리뷰 이미지 ${index + 1}-${idx + 1}`}
                        className="review-photo"
                        onClick={() => openModal(src || defaultImage)}
                      />
                    ));
                  })
                : null}
            </div>

            {/* 댓글 내용 */}
            <p className="review-comment">
              {expandedComments[review.review_id]
                ? review.comment
                : `${review.comment.slice(0, 100)}... `}
              {review.comment.length > 100 && (
                <button className="toggle-more" onClick={() => toggleExpand(review.review_id)}>
                  {expandedComments[review.review_id] ? '간단히' : '더보기'}
                </button>
              )}
            </p>
          </div>
        ))
      )}

      {/* 모달 */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="modal-close" onClick={closeModal}>
              &times;
            </span>
            <img src={modalImage} alt="확대된 리뷰 이미지" />
          </div>
        </div>
      )}
    </div>
  );
}
