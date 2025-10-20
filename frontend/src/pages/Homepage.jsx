import Hero from './Hero';
import Login from './Login';
import Reviews from "./Reviews";
import Credits from "./Credits";

const Homepage = () => {
  return (
    // Using React fragments (<></>) to avoid unnecessary divs and passing multiple elements
    <>
    {/* Hero, Login, Reviews, Credits are separately written in their respective .jsx files. Clean horizontal rule (HR) is added between these for aesthetics */}
    <Hero /> 
    <hr style={{ height: '1px', borderWidth: '0', backgroundColor: 'gray' }} />
    <Login />
    <hr style={{ height: '1px', borderWidth: '0', backgroundColor: 'gray' }} />
    <Reviews />
    <hr style={{ height: '1px', borderWidth: '0', backgroundColor: 'gray' }} />
    <Credits />
    <hr style={{ height: '1px', borderWidth: '0', backgroundColor: 'gray' }} />
    </>
  );
}

export default Homepage;