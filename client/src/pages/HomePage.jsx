import PlaceCard from "../components/PlaceCard";

const HomePage = ({ places }) => {
  return (
    <>
      {places.length === 0 && <p className="p-8 text-lg">No listings found.</p>}
      {places.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4">
          {places.map((place, index) => (
            <PlaceCard key={place._id + index} place={place} />
          ))}
        </div>
      )}
    </>
  );
};

export default HomePage;
