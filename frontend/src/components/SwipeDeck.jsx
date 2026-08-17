import SwipeCard from "./SwipeCard";

function SwipeDeck({
  jobs,
  currentIndex,
  direction,
  handleSwipe,
  jobScores,
}) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "650px",
        marginTop: "30px",
      }}
    >
      {jobs
        .filter(Boolean)
        .map((job, index) => (
          <SwipeCard
            key={job.id}
            job={job}
            matchScore={jobScores?.[job.id] ?? 0}
            index={index}
            currentIndex={currentIndex}
            direction={index === currentIndex ? direction : 0}
            onSwipe={handleSwipe}
          />
        ))}
    </div>
  );
}

export default SwipeDeck;