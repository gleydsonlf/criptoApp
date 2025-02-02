import { Link } from "react-router-dom";
import logoImg from "../../assets/logo.svg";
import styles from "./header.module.css";

export default function Header() {
  return (
    <header className={styles.container}>
      <Link to="/">
        <img src={logoImg} alt="logo" />
      </Link>
    </header>
  );
}
