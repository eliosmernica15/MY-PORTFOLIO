"use client";

import React, { Suspense } from "react";
import CustomCursor from "./CustomCursor";
import AmbientBackground from "./AmbientBackground";
import Nav from "./Nav";
import Hero from "./Hero";
import About from "./About";
import Services from "./Services";
import Projects from "./Projects";
import StatsSection from "./StatsSection";
import Resume from "./Resume";
import StackSection from "./StackSection";
import { NotesTeaser } from "./NotesTeaser";
import { GitHubActivity } from "./GitHubActivity";
import Testimonials from "./Testimonials";
import Contact from "./Contact";
import Footer from "./Footer";
import { ErrorBoundary } from "./ui/ErrorBoundary";

// Skeleton loader components
const SkeletonCard = () => (
  <div
    className="aspect-[16/10] rounded-2xl animate-pulse"
    style={{
      background:
        "linear-gradient(90deg, var(--bg-card) 25%, var(--border) 50%, var(--bg-card) 75%)",
      backgroundSize: "200% 100%",
      border: "1px solid var(--border)",
    }}
  />
);

const SkeletonFeaturedCard = () => (
  <div
    className="md:col-span-2 aspect-[4/3] rounded-2xl animate-pulse"
    style={{
      background:
        "linear-gradient(90deg, var(--bg-card) 25%, var(--border) 50%, var(--bg-card) 75%)",
      backgroundSize: "200% 100%",
      border: "1px solid var(--border)",
    }}
  />
);

const SkeletonStats = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
    {[1, 2, 3, 4].map((i) => (
      <div
        key={i}
        className="stat-card-enterprise p-5 sm:p-6 md:p-8 rounded-[1.25rem] sm:rounded-[1.5rem] md:rounded-[2rem] border text-center animate-pulse"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border)",
        }}
      >
        <div
          className="h-12 w-24 mx-auto mb-2 sm:mb-3 rounded"
          style={{
            background:
              "linear-gradient(90deg, var(--bg-card) 25%, var(--border) 50%, var(--bg-card) 75%)",
            backgroundSize: "200% 100%",
          }}
        />
        <div
          className="h-4 w-32 mx-auto rounded"
          style={{
            background:
              "linear-gradient(90deg, var(--bg-card) 25%, var(--border) 50%, var(--bg-card) 75%)",
            backgroundSize: "200% 100%",
          }}
        />
      </div>
    ))}
  </div>
);

const SkeletonResume = () => (
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-16">
    <div className="lg:col-span-4 space-y-8 sm:space-y-10">
      <div
        className="h-8 w-48 rounded animate-pulse"
        style={{
          background:
            "linear-gradient(90deg, var(--bg-card) 25%, var(--border) 50%, var(--bg-card) 75%)",
          backgroundSize: "200% 100%",
        }}
      />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-14 rounded animate-pulse"
            style={{
              background:
                "linear-gradient(90deg, var(--bg-card) 25%, var(--border) 50%, var(--bg-card) 75%)",
              backgroundSize: "200% 100%",
            }}
          />
        ))}
      </div>
      <div
        className="h-12 w-full rounded animate-pulse"
        style={{
          background:
            "linear-gradient(90deg, var(--bg-card) 25%, var(--border) 50%, var(--bg-card) 75%)",
          backgroundSize: "200% 100%",
        }}
      />
    </div>
    <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
      {[1, 2].map((col) => (
        <div key={col} className="space-y-6">
          <div
            className="h-6 w-32 rounded animate-pulse"
            style={{
              background:
                "linear-gradient(90deg, var(--bg-card) 25%, var(--border) 50%, var(--bg-card) 75%)",
              backgroundSize: "200% 100%",
            }}
          />
          <div
            className="space-y-6 pl-6"
            style={{ borderLeft: "1px solid var(--border)" }}
          >
            {[1, 2, 3].map((i) => (
              <div key={i} className="relative group animate-pulse">
                <div
                  className="absolute -left-[27px] top-1.5 w-2.5 h-2.5 rounded-full"
                  style={{ background: "var(--border)" }}
                />
                <div
                  className="h-3 w-24 rounded"
                  style={{
                    background:
                      "linear-gradient(90deg, var(--bg-card) 25%, var(--border) 50%, var(--bg-card) 75%)",
                    backgroundSize: "200% 100%",
                  }}
                />
                <div
                  className="h-5 w-48 rounded mt-1"
                  style={{
                    background:
                      "linear-gradient(90deg, var(--bg-card) 25%, var(--border) 50%, var(--bg-card) 75%)",
                    backgroundSize: "200% 100%",
                  }}
                />
                <div
                  className="h-4 w-64 rounded mt-1"
                  style={{
                    background:
                      "linear-gradient(90deg, var(--bg-card) 25%, var(--border) 50%, var(--bg-card) 75%)",
                    backgroundSize: "200% 100%",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const SkeletonSkills = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 md:gap-x-16 gap-y-6 md:gap-y-8">
    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
      <div key={i} className="space-y-2.5 animate-pulse">
        <div className="flex justify-between">
          <div
            className="h-3 w-24 rounded"
            style={{
              background:
                "linear-gradient(90deg, var(--bg-card) 25%, var(--border) 50%, var(--bg-card) 75%)",
              backgroundSize: "200% 100%",
            }}
          />
          <div
            className="h-3 w-12 rounded"
            style={{
              background:
                "linear-gradient(90deg, var(--bg-card) 25%, var(--border) 50%, var(--bg-card) 75%)",
              backgroundSize: "200% 100%",
            }}
          />
        </div>
        <div className="h-1.5 w-full bg-[var(--border)] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              background:
                "linear-gradient(90deg, var(--bg-card) 25%, var(--accent) 50%, var(--bg-card) 75%)",
              backgroundSize: "200% 100%",
              width: "60%",
            }}
          />
        </div>
      </div>
    ))}
  </div>
);

const SkeletonTestimonials = () => (
  <div className="flex items-center justify-center min-h-[440px] sm:min-h-[420px]">
    <div className="max-w-3xl w-full text-center relative animate-pulse">
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
        }}
      >
        <div className="p-6 sm:p-10 md:p-14 relative overflow-hidden">
          <div
            className="h-12 w-32 mx-auto mb-6 rounded"
            style={{
              background:
                "linear-gradient(90deg, var(--bg-card) 25%, var(--border) 50%, var(--bg-card) 75%)",
              backgroundSize: "200% 100%",
            }}
          />
          <div
            className="h-6 w-64 mx-auto mb-4 rounded"
            style={{
              background:
                "linear-gradient(90deg, var(--bg-card) 25%, var(--border) 50%, var(--bg-card) 75%)",
              backgroundSize: "200% 100%",
            }}
          />
          <div
            className="h-4 w-48 mx-auto mb-4 rounded"
            style={{
              background:
                "linear-gradient(90deg, var(--bg-card) 25%, var(--border) 50%, var(--bg-card) 75%)",
              backgroundSize: "200% 100%",
            }}
          />
          <div
            className="w-16 h-16 rounded-full mx-auto mb-3"
            style={{
              background:
                "linear-gradient(90deg, var(--bg-card) 25%, var(--border) 50%, var(--bg-card) 75%)",
              backgroundSize: "200% 100%",
            }}
          />
          <div
            className="h-5 w-32 mx-auto mb-1 rounded"
            style={{
              background:
                "linear-gradient(90deg, var(--bg-card) 25%, var(--border) 50%, var(--bg-card) 75%)",
              backgroundSize: "200% 100%",
            }}
          />
          <div
            className="h-3 w-40 mx-auto rounded"
            style={{
              background:
                "linear-gradient(90deg, var(--bg-card) 25%, var(--border) 50%, var(--bg-card) 75%)",
              backgroundSize: "200% 100%",
            }}
          />
        </div>
      </div>
    </div>
  </div>
);

const SkeletonContact = () => (
  <div className="p-8 md:p-12 relative overflow-hidden">
    <div className="space-y-5 animate-pulse">
      <div
        className="h-3 w-48 rounded"
        style={{
          background:
            "linear-gradient(90deg, var(--bg-card) 25%, var(--border) 50%, var(--bg-card) 75%)",
          backgroundSize: "200% 100%",
        }}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <div
            className="h-3 w-32 rounded"
            style={{
              background:
                "linear-gradient(90deg, var(--bg-card) 25%, var(--border) 50%, var(--bg-card) 75%)",
              backgroundSize: "200% 100%",
            }}
          />
          <div
            className="h-10 w-full rounded"
            style={{
              background:
                "linear-gradient(90deg, var(--bg-card) 25%, var(--border) 50%, var(--bg-card) 75%)",
              backgroundSize: "200% 100%",
            }}
          />
        </div>
        <div className="space-y-2">
          <div
            className="h-3 w-32 rounded"
            style={{
              background:
                "linear-gradient(90deg, var(--bg-card) 25%, var(--border) 50%, var(--bg-card) 75%)",
              backgroundSize: "200% 100%",
            }}
          />
          <div
            className="h-10 w-full rounded"
            style={{
              background:
                "linear-gradient(90deg, var(--bg-card) 25%, var(--border) 50%, var(--bg-card) 75%)",
              backgroundSize: "200% 100%",
            }}
          />
        </div>
      </div>
      <div className="space-y-2">
        <div
          className="h-3 w-32 rounded"
          style={{
            background:
              "linear-gradient(90deg, var(--bg-card) 25%, var(--border) 50%, var(--bg-card) 75%)",
            backgroundSize: "200% 100%",
          }}
        />
        <div
          className="h-28 w-full rounded"
          style={{
            background:
              "linear-gradient(90deg, var(--bg-card) 25%, var(--border) 50%, var(--bg-card) 75%)",
            backgroundSize: "200% 100%",
          }}
        />
      </div>
      <div
        className="h-12 w-48 rounded mx-auto"
        style={{
          background:
            "linear-gradient(90deg, var(--bg-card) 25%, var(--border) 50%, var(--bg-card) 75%)",
          backgroundSize: "200% 100%",
        }}
      />
    </div>
  </div>
);

const Home: React.FC = () => {
  return (
    <>
      <CustomCursor />
      <ErrorBoundary
        displayName="Nav"
        fallback={
          <nav
            className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4"
            style={{ pointerEvents: "none" }}
            role="navigation"
            aria-label="Main navigation (fallback)"
          >
            <div
              className="rounded-full border px-3 py-2 text-center"
              style={{
                background: "var(--bg-card)",
                borderColor: "var(--border)",
                color: "var(--text-secondary)",
                width: "fit-content",
              }}
            >
              Navigation unavailable
            </div>
          </nav>
        }
      >
        <Nav />
      </ErrorBoundary>
      <AmbientBackground />
      <main id="main-content">
        <Hero />
        <About />
        <Services />
        <Suspense fallback={<SkeletonCard />}>
          <Projects />
        </Suspense>
        <Suspense fallback={<SkeletonSkills />}>
          <StackSection />
        </Suspense>
        <Suspense fallback={<SkeletonStats />}>
          <StatsSection />
        </Suspense>
        <Suspense fallback={<SkeletonResume />}>
          <Resume />
        </Suspense>
        <NotesTeaser />
        <Suspense fallback={<SkeletonCard />}>
          <GitHubActivity />
        </Suspense>
        <Suspense fallback={<SkeletonTestimonials />}>
          <Testimonials />
        </Suspense>
        <Suspense fallback={<SkeletonContact />}>
          <Contact />
        </Suspense>
      </main>
      <Footer />
    </>
  );
};

export default Home;
