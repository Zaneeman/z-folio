"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useRotation } from "@/hooks/useRotation";
import Header from "@/components/Header";
import IndexToggle from "@/components/IndexToggle";
import SplashView from "@/components/SplashView";
import IndexView from "@/components/IndexView";
import ProjectView from "@/components/ProjectView";
import type { Project } from "@/lib/constants";

// Matches the longest animation duration in each keyframe group in
// globals.css, so the outgoing pane isn't unmounted mid-animation.
const OPEN_CLEANUP_MS = 700; // .pane-enter / .pane-exit / .tiles-exit
const CLOSE_CLEANUP_MS = 1400; // .pane-enter-reverse / .pane-exit-reverse / .tiles-enter

// Safety net for the "reel" transition below, in case the browser never
// fires `scrollend` (older Safari) — comfortably longer than any native
// smooth scroll should take.
const REEL_FALLBACK_MS = 1500;

type OutgoingPane = { project: Project | null };

export default function AppShell({
  featuredImages,
}: {
  featuredImages: Record<string, string[]>;
}) {
  const { state, isIndex } = useRotation();

  const [activeProject, setActiveProject] = useState<Project | null>(null);

  // The pane that was on screen just before a project-tile click, kept
  // mounted underneath the incoming one so it can fade out instead of
  // disappearing instantly.
  const [outgoing, setOutgoing] = useState<OutgoingPane | null>(null);

  // Bumped on every project-tile click so the incoming pane below always
  // remounts (fresh React key) and replays its slide-in animation, even
  // when navigating from one project straight to another.
  const [paneKey, setPaneKey] = useState(0);

  // Which animation the transition tied to the current paneKey should
  // play: "open" (index -> project), "close" (Back to Index), or "reel"
  // (project -> project, via a related-projects link).
  const [mode, setMode] = useState<"open" | "close" | "reel">("open");

  const contentRef = useRef<HTMLDivElement>(null);
  const incomingRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isIndex) {
      if (exitTimer.current) clearTimeout(exitTimer.current);
      setOutgoing(null);
      setActiveProject(null);

      // reset scroll when returning to index
      
    }
  }, [isIndex]);

  // The "reel" transition (project -> project, via a related-projects
  // link) doesn't use a CSS transform at all — it stacks the outgoing
  // project directly above the incoming one in true document flow, then
  // lets the browser's own smooth scrolling carry the view down through
  // whatever's left of the current page and into the new one. That's the
  // only way to get a distance-correct scroll regardless of how tall any
  // given project's image gallery happens to be, without fighting the
  // container's native scrollbar with a second, independent animation.
  useEffect(() => {
    if (mode !== "reel") return;

    const container = contentRef.current;
    if (!container) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    incomingRef.current?.scrollIntoView({
      behavior: reduceMotion ? "instant" : "smooth",
      block: "start",
    });

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      // flushSync forces the removal to actually commit before the scroll
      // reset below runs — otherwise scrollTo(0) would fire against the
      // still-present outgoing pane (still in the DOM until React's next
      // async commit) and briefly flash back to its top instead of
      // landing on the incoming pane's.
      flushSync(() => setOutgoing(null));
      // The incoming pane's top is now exactly at the container's top —
      // dropping the outgoing pane above it and resetting scrollTop to 0
      // lands on the same visual frame, so this is not a visible jump.
      container.scrollTo({ top: 0, behavior: "instant" });
    };

    if (reduceMotion) {
      finish();
      return;
    }

    container.addEventListener("scrollend", finish, { once: true });
    const fallback = setTimeout(finish, REEL_FALLBACK_MS);

    return () => {
      container.removeEventListener("scrollend", finish);
      clearTimeout(fallback);
    };
  }, [paneKey, mode]);


  const openProject = (project: Project) => {
    if (exitTimer.current) clearTimeout(exitTimer.current);

    // Index -> project opens; project -> project (a related-projects
    // link) plays the distinct upward "reel" scroll instead, handled
    // entirely by the effect above.
    const fromIndex = activeProject === null;

    // The outgoing index pane is about to go `position: absolute` (see
    // render below), dropping out of flow, so the wrapper's scrollable
    // height instantly shrinks to just the incoming project's height. If
    // that's shorter than the scroll position the user had reached on the
    // index, the browser clamps scrollTop the moment the DOM commits —
    // before the smooth scroll below gets a chance to run — producing a
    // jarring snap-then-smooth-scroll instead of one continuous motion.
    // Locking the wrapper to its current height for the transition keeps
    // the container scrollable all the way down until the smooth scroll
    // (and the outgoing pane's unmount) has resolved it back to 0.
    if (fromIndex && contentRef.current && wrapperRef.current) {
      wrapperRef.current.style.minHeight = `${contentRef.current.scrollHeight}px`;
    }

    setOutgoing({ project: activeProject });
    setActiveProject(project);
    setMode(fromIndex ? "open" : "reel");
    setPaneKey((k) => k + 1);

    if (fromIndex) {
  requestAnimationFrame(() => {
    contentRef.current?.scrollTo({
      top: 0,
      behavior: "instant",
    });
  });

  exitTimer.current = setTimeout(() => {
    setOutgoing(null);

    if (wrapperRef.current) {
      wrapperRef.current.style.height = "";
    }
  }, OPEN_CLEANUP_MS);
}
  };


  // Used by IndexToggle: leaving the index rotation entirely, so there's
  // no in-pane transition to animate.
  const resetProject = () => {
    if (exitTimer.current) clearTimeout(exitTimer.current);
    setOutgoing(null);
    setActiveProject(null);

    requestAnimationFrame(() => {
      contentRef.current?.scrollTo({
        top: 0,
        behavior: "instant",
      });
    });
  };


  // Used by the "Back to Index" button: animates the reverse of
  // openProject — the project pane slides back out to the right while
  // the index returns, tiles sliding in from the left.
  const closeProject = () => {
    if (exitTimer.current) clearTimeout(exitTimer.current);

    setOutgoing({ project: activeProject });
    setActiveProject(null);
    setMode("close");
    setPaneKey((k) => k + 1);

    requestAnimationFrame(() => {
      contentRef.current?.scrollTo({
        top: 0,
        behavior: "instant",
      });
    });

    exitTimer.current = setTimeout(() => setOutgoing(null), CLOSE_CLEANUP_MS);
  };


  return (
    <>
      <div id="stage" aria-hidden={false}>
        <div id="rotator" data-state={state}>
          <SplashView images={featuredImages} />

          <IndexToggle
            onOpenIndex={resetProject}
          />

          <Header
            onBackToIndex={closeProject}
            isProject={activeProject !== null}
          />
        </div>
      </div>


      <div
        id="content-pane"
        data-state={state}
      >
        <div
          ref={contentRef}
          className="
            absolute
            left-0
            right-0
            bottom-0
            top-20
            overflow-y-auto
          "
        >
          <div
            ref={wrapperRef}
            className={`relative min-h-full ${
              mode === "reel" ? "" : "overflow-hidden"
            }`}
          >
            {outgoing &&
              (mode === "reel" ? (
                // True document flow, stacked directly above the incoming
                // pane below — no transform, no overlap. The scroll effect
                // above does all the work.
                <div className="relative">
                  {outgoing.project && (
                    <ProjectView
                      project={outgoing.project}
                      onProjectClick={openProject}
                    />
                  )}
                </div>
              ) : (
                <div
                  aria-hidden
                  className={`absolute inset-x-0 top-0 pointer-events-none ${
                    mode === "close" ? "pane-exit-reverse" : "pane-exit"
                  }`}
                >
                  {outgoing.project ? (
                    <ProjectView
                      project={outgoing.project}
                      onProjectClick={openProject}
                    />
                  ) : (
                    <IndexView onProjectClick={openProject} isExiting />
                  )}
                </div>
              ))}

            <div
              key={paneKey}
              ref={incomingRef}
              className={
                mode === "reel"
                  ? "relative"
                  : `relative ${
                      mode === "close" ? "pane-enter-reverse" : "pane-enter"
                    }`
              }
            >
              {activeProject ? (
                <ProjectView
                  project={activeProject}
                  onProjectClick={openProject}
                />
              ) : (
                <IndexView
                  onProjectClick={openProject}
                  isEntering={mode === "close"}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}