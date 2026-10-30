import { useRef } from "react";
// Motion library: each sticky card has its own scroll progress and transform.
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { Link } from "react-router-dom";
function JourneyCard({ item, index }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 90%", "start 25%"],
  });
  const rotateX = useTransform(scrollYProgress, [0, 1], [12, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [70, 0]);
  return (
    <div ref={ref} className={`journey-card-wrapper journey-${index}`}>
      <motion.article
        className={`journey-card ${item.tone}`}
        style={reduced ? undefined : { rotateX, y }}
      >
        <div className="journey-card-top">
          <span>{item.number} / THE NEXT CHAPTER</span>
          <span className="journey-symbol" aria-hidden="true">
            {item.symbol}
          </span>
        </div>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
        <Link to={item.to} className="journey-link">
          {item.action}
          <span aria-hidden="true">↗</span>
        </Link>
        <div className={`journey-art art-${index}`} aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
      </motion.article>
    </div>
  );
}
export default function StickyJourney({ items }) {
  return (
    <section className="journey-section page-container" id="discover">
      <div className="journey-intro">
        <span className="eyebrow">CHOOSE YOUR DIRECTION</span>
        <h2>
          There’s more
          <br />
          than one way
          <br />
          <em>forward.</em>
        </h2>
        <p>
          A new role. A new skill. A new perspective. Make space for all three.
        </p>
        <span className="journey-arrow" aria-hidden="true">
          ↘
        </span>
      </div>
      <div className="journey-stack">
        {items.map((item, index) => (
          <JourneyCard key={item.number} item={item} index={index} />
        ))}
      </div>
    </section>
  );
}
