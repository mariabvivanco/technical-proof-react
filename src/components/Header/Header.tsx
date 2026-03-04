import styles from './Header.module.scss';

const DESCRIPTION =
  'Lorem ipsum dolor sit amet consectetur adipiscing, elit mus primis nec inceptos. Lacinia habitasse arcu molestie maecenas cursus quam nunc, hendrerit posuere augue fames dictumst placerat porttitor, dis mi pharetra vestibulum venenatis phasellus.';

const Header = () => {
  return (
    <div className={styles.header}>
      <h1 className={styles.title}>This is a technical proof</h1>
      <p className={styles.description}>{DESCRIPTION}</p>
    </div>
  );
};

export default Header;