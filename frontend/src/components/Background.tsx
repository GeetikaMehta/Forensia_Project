import bgImage from "../assets/images/a2.jpg";

const Background = () => {
  return (
    <div
      className="fixed inset-0 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${bgImage})`,
        filter: "brightness(0.4)",
        zIndex: 0,
      }}
    >
      <div className="absolute inset-0 bg-black opacity-60"></div>
    </div>
  );
};

export default Background;
