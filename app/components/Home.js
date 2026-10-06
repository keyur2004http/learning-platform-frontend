import Link from "next/link";
import { BACKEND_URL } from "../lib/config";
async function getProfile() {
  try {
    const response = await fetch(
     `${BACKEND_URL}/api/profile`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch {
    return null;
  }
}

async function getDashboard() {
  try {
    const response = await fetch(
    `${BACKEND_URL}/api/dashboard`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch {
    return null;
  }
}

async function getCourses() {
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/courses/?page=1`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();

    return data.results || [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const profile = await getProfile();

  // =========================
  // LOGGED-IN HOME
  // =========================

  if (profile) {
    const dashboard = await getDashboard();

    if (!dashboard) {
      return (
        <main className="dashboard-page">
          <h1>Welcome back, {profile.username} 👋</h1>
          <p>Unable to load your dashboard.</p>
        </main>
      );
    }

    const hasAuthorData =
      dashboard.author.total_courses > 0;

    return (
      <main className="dashboard-page">

        <section className="dashboard-header">
          <p className="dashboard-label">
            WELCOME BACK
          </p>

          <h1>
            Hello, {profile.username} 👋
          </h1>

          <p>
            Here is a quick look at your learning activity.
          </p>
        </section>

        {/* Student Stats */}
        <section className="dashboard-section">

          <div className="section-title">
            <h2>Your Learning</h2>
            <p>Track your learning progress</p>
          </div>

          <div className="stats-grid">

            <div className="stat-card">
              <span className="stat-icon">📚</span>

              <p>Enrolled Courses</p>

              <h3>
                {dashboard.student.enrolled_courses}
              </h3>
            </div>

            <div className="stat-card">
              <span className="stat-icon">✅</span>

              <p>Completed Lessons</p>

              <h3>
                {dashboard.student.completed_lessons}
              </h3>
            </div>

            <div className="stat-card">
              <span className="stat-icon">📈</span>

              <p>Overall Progress</p>

              <h3>
                {dashboard.student.overall_progress}%
              </h3>
            </div>

            <div className="stat-card">
              <span className="stat-icon">🏆</span>

              <p>Completed Courses</p>

              <h3>
                {dashboard.student.completed_courses}
              </h3>
            </div>

          </div>
        </section>

        {/* Author Stats */}
        {hasAuthorData && (
          <section className="dashboard-section">

            <div className="section-title">
              <h2>Your Courses</h2>
              <p>See your course statistics</p>
            </div>

            <div className="stats-grid author-grid">

              <div className="stat-card">
                <span className="stat-icon">🎓</span>

                <p>Total Courses</p>

                <h3>
                  {dashboard.author.total_courses}
                </h3>
              </div>

              <div className="stat-card">
                <span className="stat-icon">👥</span>

                <p>Total Students</p>

                <h3>
                  {dashboard.author.total_students}
                </h3>
              </div>

            </div>
          </section>
        )}

        <section className="dashboard-actions">

          <Link href="/courses">
            Explore Courses →
          </Link>

          {hasAuthorData && (
            <Link href="/my-created-courses">
              Manage My Courses →
            </Link>
          )}

        </section>

      </main>
    );
  }

  // =========================
  // LOGGED-OUT HOME
  // =========================

  const courses = await getCourses();
  const featuredCourses = courses.slice(0, 3);

  return (
    <div className="home">

      <section className="hero">

        <div className="hero-content">

          <p className="hero-small-title">
            LEARN • BUILD • GROW
          </p>

          <h1>
            Learn skills.
            <br />
            <span>Build real projects.</span>
          </h1>

          <p className="hero-description">
            Learn programming and web development through practical
            courses, real projects, and hands-on lessons.
          </p>

          <div className="hero-buttons">

            <Link
              href="/courses"
              className="primary-button"
            >
              Explore Courses
            </Link>

            <Link
              href="/register"
              className="secondary-button"
            >
              Start Learning
            </Link>

          </div>

        </div>

        <div className="hero-card">

          <div className="hero-card-top">
            <span>YOUR LEARNING</span>
            <span>🚀</span>
          </div>

          <h3>
            Build your skills step by step.
          </h3>

          <div className="progress-item">

            <div className="progress-header">
              <span>Django REST API</span>
              <span>75%</span>
            </div>

            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>

          </div>

          <div className="hero-stat-row">

            <div>
              <strong>Practical</strong>
              <span>Learning</span>
            </div>

            <div>
              <strong>Real</strong>
              <span>Projects</span>
            </div>

            <div>
              <strong>Track</strong>
              <span>Progress</span>
            </div>

          </div>

        </div>

      </section>

      {/* Features */}

      <section className="features-section">

        <div className="section-heading">

          <p className="section-label">
            WHY LEARN HERE?
          </p>

          <h2>
            Learning that focuses on doing.
          </h2>

          <p>
            Learn concepts and use them to build something real.
          </p>

        </div>

        <div className="features-grid">

          <div className="feature-card">
            <div className="feature-icon">💻</div>

            <h3>Practical Projects</h3>

            <p>
              Learn by building real applications instead of only
              studying theory.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⚡</div>

            <h3>Learn at Your Pace</h3>

            <p>
              Move through lessons at your own speed and continue
              whenever you are ready.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📈</div>

            <h3>Track Progress</h3>

            <p>
              Complete lessons and keep track of your learning progress.
            </p>
          </div>

        </div>

      </section>

      {/* Featured Courses */}

      <section className="courses-section">

        <div className="section-heading courses-heading">

          <div>

            <p className="section-label">
              START LEARNING
            </p>

            <h2>
              Featured Courses
            </h2>

            <p>
              Explore courses and start building your skills.
            </p>

          </div>

          <Link
            href="/courses"
            className="view-all"
          >
            View All Courses →
          </Link>

        </div>

        {featuredCourses.length > 0 ? (

          <div className="courses-grid">

            {featuredCourses.map((course) => (

              <div
                className="course-card"
                key={course.id}
              >

                <div className="course-image">

                  <span>
                    {course.category === "programming"
                      ? "PROGRAMMING"
                      : course.category === "web"
                      ? "WEB DEVELOPMENT"
                      : course.category === "database"
                      ? "DATABASE"
                      : course.category === "devops"
                      ? "DEVOPS"
                      : "DEVELOPMENT"}
                  </span>

                </div>

                <div className="course-content">

                  <p className="course-category">
                    {course.category}
                  </p>

                  <h3>
                    {course.title}
                  </h3>

                  <p className="course-description">
                    {course.description}
                  </p>

                  <div className="course-bottom">

                    <strong>
                      ₹{course.price}
                    </strong>

                    <Link
                      href={`/courses/${course.id}`}
                    >
                      View Course →
                    </Link>

                  </div>

                </div>

              </div>

            ))}

          </div>

        ) : (

          <div className="empty-courses">

            <h3>
              No courses available yet.
            </h3>

            <p>
              Check back soon for new courses.
            </p>

          </div>

        )}

      </section>

      {/* How It Works */}

      <section className="how-section">

        <div className="section-heading">

          <p className="section-label">
            HOW IT WORKS
          </p>

          <h2>
            Your learning journey.
          </h2>

          <p>
            Start learning in just a few simple steps.
          </p>

        </div>

        <div className="steps">

          <div className="step">

            <div className="step-number">
              01
            </div>

            <h3>
              Choose a Course
            </h3>

            <p>
              Find a course that matches what you want to learn.
            </p>

          </div>

          <div className="step-line"></div>

          <div className="step">

            <div className="step-number">
              02
            </div>

            <h3>
              Enroll & Learn
            </h3>

            <p>
              Enroll in the course and start going through the lessons.
            </p>

          </div>

          <div className="step-line"></div>

          <div className="step">

            <div className="step-number">
              03
            </div>

            <h3>
              Track Your Progress
            </h3>

            <p>
              Complete lessons and watch your progress grow.
            </p>

          </div>

        </div>

      </section>

      {/* Final CTA */}

      <section className="cta-section">

        <div>

          <p className="section-label">
            READY TO START?
          </p>

          <h2>
            Start building your skills today.
          </h2>

          <p>
            Explore practical courses and take the next step in your
            development journey.
          </p>

        </div>

        <Link
          href="/courses"
          className="cta-button"
        >
          Explore Courses →
        </Link>

      </section>

    </div>
  );
}