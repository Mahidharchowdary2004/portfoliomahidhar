import { useResource } from '../hooks/useResource';
import { defaultAchievements } from '../data/defaults';

const NAV_LINKS = [
  { label: 'Home', hash: '#home' },
  { label: 'About', hash: '#about' },
  { label: 'Skills', hash: '#skills' },
  { label: 'Experience', hash: '#experience' },
  { label: 'Projects', hash: '#projects' },
  { label: 'Certifications', hash: '#certifications' },
  { label: 'Achievements', hash: '#achievements' }
];

export default function Header() {
  const achievements = useResource('/achievements', defaultAchievements);
  const links = achievements.length > 0
    ? NAV_LINKS
    : NAV_LINKS.filter(link => link.hash !== '#achievements');

  return (
    <header>
      <div className="navbar">
        <div className="logo">mahidhar<span>.</span>dev</div>

        <nav>
          <ul>
            {links.map(link => (
              <li key={link.hash}><a href={link.hash}>{link.label}</a></li>
            ))}
          </ul>
        </nav>
        <a className="nav-cta" href="#contact">$ contact --me</a>
      </div>
    </header>
  );
}
