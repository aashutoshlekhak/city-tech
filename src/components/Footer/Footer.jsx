import "./Footer.css";

export const Footer = () => {
  const currentDate = new Date().getFullYear();
  return (
    <footer className="footer">
      <p>&copy; {currentDate} citytech</p>
    </footer>
  );
};
