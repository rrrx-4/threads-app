'use client';

interface LikeBtnProps  {
  handleLikeClick: () => void; // Define the type for handleLikeClick
};


const LikeBtn  = ({handleLikeClick} : LikeBtnProps) => {
  return (
    <button type="button" onClick={handleLikeClick} >
        Like
    </button>
  )
}

export default LikeBtn