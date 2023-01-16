import { Link, useNavigate } from "react-router-dom";

import "./index.css";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <>
      <main className="main-main">
        <nav className="main-nav">
          <div>
            <h1>Clubverse</h1>
          </div>
          <div className="main-list">
            <div className="link-other">
              <Link to="/">Home</Link>
            </div>
            <div className="link-other">
              <Link to="/register">Get Started</Link>
            </div>
            <div className="main-login" onClick={() => navigate("/login")}>
              <Link to="/login">Login</Link>
            </div>
          </div>
        </nav>
        <div className="main-wrapper">
          <div className="main-left">
            <div className="main-container">
              <div className="main-img-container" style={{ display: "none" }}>
                <img
                  className="main-img-ylw"
                  src="/assets/logoyellow.png"
                  alt=""
                />
                <img
                  className="main-img-blue"
                  src="/assets/logoblue.png"
                  alt=""
                />
              </div>
              <h1>All the school's clubs</h1>
              <h4>ACCESSIBLE IN ONE PLACE</h4>
              <div className="main-links">
                <div className="main-login" onClick={() => navigate("/login")}>
                  <Link to="/login">Login</Link>
                </div>
                <div
                  className="main-login"
                  onClick={() => navigate("/register")}
                >
                  <Link to="/register">Get Started</Link>
                </div>
              </div>
            </div>
          </div>

          <div className="main-right">
            <img className="main-img-ylw" src="/assets/logoyellow.png" alt="" />
            <img className="main-img-blue" src="/assets/logoblue.png" alt="" />
          </div>
        </div>
      </main>
      <section className="main-section">
        <div className="main-section-wrapper">
          <div className="main-info-group">
            <div className="main-img-container">
              <img src="" alt="" />
            </div>
            <div className="main-text-side">
              <h1>Lorem ipsum</h1>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse pellentesque sed neque quis porttitor. Suspendisse
                maximus, leo in molestie ullamcorper, erat orci suscipit mi,
                rutrum semper ex nunc ut mi. Nam at venenatis felis.
                Pellentesque id cursus nibh. Cras interdum hendrerit erat sit
                amet varius. Pellentesque interdum pretium felis
              </p>
            </div>
          </div>
          <div className="main-info-group">
            <div className="main-img-container">
              <img src="" alt="" />
            </div>
            <div className="main-text-side">
              <h1>Lorem ipsum</h1>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse pellentesque sed neque quis porttitor. Suspendisse
                maximus, leo in molestie ullamcorper, erat orci suscipit mi,
                rutrum semper ex nunc ut mi. Nam at venenatis felis.
                Pellentesque id cursus nibh. Cras interdum hendrerit erat sit
                amet varius. Pellentesque interdum pretium felis
              </p>
            </div>
          </div>
          <div className="main-info-group">
            <div className="main-img-container">
              <img src="" alt="" />
            </div>
            <div className="main-text-side">
              <h1>Lorem ipsum</h1>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse pellentesque sed neque quis porttitor. Suspendisse
                maximus, leo in molestie ullamcorper, erat orci suscipit mi,
                rutrum semper ex nunc ut mi. Nam at venenatis felis.
                Pellentesque id cursus nibh. Cras interdum hendrerit erat sit
                amet varius. Pellentesque interdum pretium felis
              </p>
            </div>
          </div>
        </div>
      </section>
      <footer>
        <div className="footer-wrapper">
          <div className="footer-general">
            <h3>General</h3>
            <div className="general-links">
              <div>
                <Link to="/">Home</Link>
              </div>
              <div>
                <Link to="/login">Login</Link>
              </div>
              <div>
                <Link to="/register">Get Started</Link>
              </div>
            </div>
          </div>
          <div className="footer-resources">
            <h3>Resources</h3>
            <div className="resources-links">
              <div>
                <a target="_blank" href="https://github.com/Clubverse-TSA/">
                  Github
                </a>
              </div>
              <div>
                <a target="_blank" href="https://www.texastsa.org/">
                  Texas TSA
                </a>
              </div>
              <div>
                <a target="_blank" href="https://tsaweb.org/">
                  National TSA
                </a>
              </div>
              <div>
                <a target="_blank" href="https://scienceacademy.stisd.net/">
                  Science Academy
                </a>
              </div>
            </div>
          </div>
          <div className="footer-logo-container">
            <div className="footer-logo">
              <img src="/assets/logogray.png" alt="" />
              <div>
                <h1>Clubverse</h1>
              </div>
            </div>
            <div className="copyright">
              <p>Copyright &copy; 2022 TSA. All Rights Reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
