/**
 * Project route loading skeleton.
 *
 * Renders immediately when the user clicks a project link, before the
 * page chunk has been fetched and parsed. Without this, Next.js keeps
 * the previous page on screen during the navigation transition — the
 * click feels like a hang for 150-400ms while the JS chunk for the
 * project route downloads. Showing a skeleton immediately reassures
 * the user that the click registered and the page is on its way.
 *
 * Server component: no JS, renders inside the streaming RSC payload
 * so the user sees it as soon as the click triggers a route change.
 */
export default function ProjectLoading() {
  return (
    <div
      className="pt-24 sm:pt-28 md:pt-32 pb-20 sm:pb-24 px-4 sm:px-6 max-w-6xl mx-auto relative z-[1]"
      aria-busy="true"
      aria-label="Loading project"
    >
      {/* Back-link skeleton */}
      <div className="mb-10 sm:mb-14 flex flex-wrap items-center gap-3 sm:gap-4">
        <div
          className="h-3 w-32 sm:w-40 rounded animate-pulse"
          style={{ background: 'var(--surface-elevated)' }}
        />
        <div
          className="h-3 w-28 sm:w-36 rounded animate-pulse"
          style={{ background: 'var(--surface-elevated)' }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12">
        {/* Left column: image + title + description */}
        <div className="lg:col-span-8 space-y-8 sm:space-y-10">
          <div
            className="aspect-[16/9] rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] overflow-hidden animate-pulse"
            style={{ background: 'var(--surface-elevated)' }}
          />
          <div className="space-y-4 sm:space-y-6">
            <div
              className="h-12 sm:h-16 md:h-20 w-3/4 rounded animate-pulse"
              style={{ background: 'var(--surface-elevated)' }}
            />
            <div className="space-y-2.5">
              <div
                className="h-3.5 sm:h-4 w-full rounded animate-pulse"
                style={{ background: 'var(--surface-elevated)' }}
              />
              <div
                className="h-3.5 sm:h-4 w-11/12 rounded animate-pulse"
                style={{ background: 'var(--surface-elevated)' }}
              />
              <div
                className="h-3.5 sm:h-4 w-10/12 rounded animate-pulse"
                style={{ background: 'var(--surface-elevated)' }}
              />
              <div
                className="h-3.5 sm:h-4 w-9/12 rounded animate-pulse"
                style={{ background: 'var(--surface-elevated)' }}
              />
            </div>
          </div>
        </div>

        {/* Right column: spec card */}
        <div className="lg:col-span-4">
          <div
            className="p-6 sm:p-8 rounded-2xl border animate-pulse space-y-5"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
          >
            <div
              className="h-2.5 w-24 rounded"
              style={{ background: 'var(--surface-elevated)' }}
            />
            {[0, 1, 2].map(i => (
              <div key={i} className="space-y-1.5">
                <div
                  className="h-2 w-12 rounded"
                  style={{ background: 'var(--surface-elevated)' }}
                />
                <div
                  className="h-3.5 w-20 rounded"
                  style={{ background: 'var(--surface-elevated)' }}
                />
              </div>
            ))}
            <div
              className="h-11 w-full rounded-xl mt-4"
              style={{ background: 'var(--surface-elevated)' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
