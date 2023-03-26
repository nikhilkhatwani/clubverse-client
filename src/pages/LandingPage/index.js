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
              <img src="assets/main_section.png" alt="" />
            </div>
            <div className="main-text-side">
              <h1>A platform just for clubs.</h1>
              <p>
                Clubverse allows the administrator to setup accounts for all
                students and teachers so that they can focus on their clubs. All
                clubs are readily accessible to students in one place, so
                there's no need for students to try and figure out exactly a
                specific club is or to stress over when and where a club's
                meetings take place.
              </p>
            </div>
          </div>
          <div className="main-info-group">
            <div className="main-img-container">
              <img src="assets/members_section.jpg" alt="" />
            </div>
            <div className="main-text-side">
              <h1>Stay in touch with members.</h1>
              <p>
                Clubverse allows club sponsors and officers to easily make
                announcements and categorize them for specific audiences
                (Public, Members only, Officers only). There is no longer a need
                for students to go from platform to platform checking for new
                announcements from a club they are in.
              </p>
            </div>
          </div>
          <div className="main-info-group">
            <div className="main-img-container">
              <img src="assets/dues_section.jpg" alt="" />
            </div>
            <div className="main-text-side">
              <h1>Manage club dues.</h1>
              <p>
                Gone are the days of sorting through checks and receipts to
                check whether a member has submitted dues or not. Sponsors can
                easily keep track of who has and has not paid their dues. This
                makes keeping track of funds a lot easier for club sponsors.
              </p>
            </div>
          </div>
          <div className="main-info-group">
            <div className="main-img-container">
              <img
                className="main-img-container-attendance"
                src="assets/attendance_section.jpg"
                alt=""
              />
            </div>
            <div className="main-text-side">
              <h1>Manage attendance.</h1>
              <p>
                Instead of a google form or a physical sign in sheet, Clubverse
                manages attendance effectively by allowing sponsors and officers
                to create a meeting with the click of a button and keep track of
                who attends and who doesn't. Clubverse also allows sponsors to
                easily see how many absences a member has.
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
                <a target="_blank" href="assets/WORK_LOG.pdf">
                  Work Log
                </a>
              </div>
              <div>
                <a target="_blank" href="assets/COPYRIGHT_LIST.pdf">
                  Copyright List
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
