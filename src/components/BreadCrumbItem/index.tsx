import React from 'react';
import { Link } from 'react-router-dom';

interface BreadCrumbItemProps {
  link?: string;
  label: string;
}

const BreadCrumbItem: React.FC<BreadCrumbItemProps> = ({ link, label }) => {
  return (
    <>
      {link ? (
        <Link to={link}>
          <h1>{label}</h1>
        </Link>
      ) : (
        <h1>{label}</h1>
      )}
    </>
  );
};

export default BreadCrumbItem;
