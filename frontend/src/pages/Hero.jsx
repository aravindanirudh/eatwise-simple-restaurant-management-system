import cloche_icon from "../assets/cloche_icon.png"; // Import the cloche or dish icon image from assets for logo

const Hero = () => {
  return (
    <section className="homepage page-background">
        <div className="navbar">
            <div className="logo-div">
                <img src={cloche_icon} alt="EatWise Logo" className="logo-img"/>
                <h1>EatWise</h1>
            </div>
            <a href="#login-section">
              <button type="button">Login</button>
            </a>
        </div>
        <div className="hero-text">
            <h1>Welcome to EatWise!</h1>
            <p>Efficient Restaurant Management System</p>
        </div>
    </section>
  )
}

export default Hero