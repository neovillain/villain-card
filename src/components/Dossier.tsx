import { motion, useReducedMotion } from 'framer-motion'
import { dossier } from '../config'
import { SectionSlash } from './v2/SectionSlash'
import './Dossier.css'

const EASE = [0.16, 1, 0.3, 1] as const

const fadeUp = (reduce: boolean | null, delay = 0) => ({
  initial: { opacity: 0, y: reduce ? 0 : 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.7, ease: EASE, delay },
})

export function Dossier() {
  const reduce = useReducedMotion()

  return (
    <section className="dossier container" id="dossier">
      <SectionSlash />
      <h2 className="section-label">
        <span className="num">02</span> the dossier
      </h2>

      <div className="dossier__top">
        <motion.div className="dossier-card dossier__profile" {...fadeUp(reduce)}>
          <span className="dossier-card__tag">subject profile</span>
          <p className="dossier__about">{dossier.about}</p>
          <dl className="dossier__facts">
            {dossier.facts.map((fact) => (
              <div className="dossier__fact" key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </motion.div>

        <motion.div
          className="dossier-card dossier__achievements"
          {...fadeUp(reduce, 0.1)}
        >
          <span className="dossier-card__tag">known victories</span>
          <ul className="dossier__wins">
            {dossier.achievements.map((win) => (
              <li key={win.title}>
                <span className="dossier__win-title">{win.title}</span>
                <span className="dossier__win-detail">{win.detail}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      <div className="dossier__projects">
        {dossier.projects.map((project, i) => {
          const card = (
            <>
              <div className="dossier-project__head">
                <h3 className="dossier-project__title">{project.title}</h3>
                <span className="dossier-project__period">{project.period}</span>
              </div>
              <p className="dossier-project__desc">{project.description}</p>
              <span className="dossier-project__tags">
                {project.tags.map((tag) => (
                  <span className="dossier-project__tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </span>
            </>
          )
          return project.url ? (
            <motion.a
              className="dossier-card dossier-project"
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              key={project.title}
              {...fadeUp(reduce, i * 0.07)}
              whileHover={reduce ? undefined : { y: -4 }}
            >
              {card}
            </motion.a>
          ) : (
            <motion.article
              className="dossier-card dossier-project"
              key={project.title}
              {...fadeUp(reduce, i * 0.07)}
              whileHover={reduce ? undefined : { y: -4 }}
            >
              {card}
            </motion.article>
          )
        })}
      </div>

      <motion.div className="dossier__skills" {...fadeUp(reduce, 0.1)}>
        <span className="dossier-card__tag">weapons of choice</span>
        <div className="dossier__skill-tags">
          {dossier.skills.map((skill) => (
            <span className="dossier__skill" key={skill}>
              {skill}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
