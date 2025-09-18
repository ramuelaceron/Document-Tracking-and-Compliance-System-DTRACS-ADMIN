import React from 'react';
import './SectionCard.css';
import sgodCircle from "../../assets/images/sgod-circle.png";

const SectionCard = ({ title, image, onClick }) => {
  return (
    <div className="section-card" onClick={onClick} role="button" tabIndex={0}>
      {/* Top gray image section */}
      <div className="section-card-image">
        <img src={image} alt={title} />
      </div>

      {/* Bottom blue content */}
      <div className="section-card-body">
        <h3>{title}</h3>
        <div className="section-card-footer">
          <img src={sgodCircle} alt="SGOD" className="sgod-logo" />
          <span>School Governance and <br/> Operations Division</span>
        </div>
      </div>
    </div>
  );
};

export default SectionCard;
