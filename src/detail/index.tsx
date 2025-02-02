import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CoinProps } from "../home";
import styles from "./detail.module.css";
import { BsArrowLeftCircle } from "react-icons/bs";

interface ResponseData {
  data: CoinProps;
}

interface ErrorData {
  error: string;
}

type DataProps = ResponseData | ErrorData;

export default function Detail() {
  const { cripto } = useParams();
  const navigate = useNavigate();

  const [coin, setCoin] = useState<CoinProps>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getCoin() {
      try {
        fetch(`https://api.coincap.io/v2/assets/${cripto}`)
          .then(response => response.json())
          .then((data: DataProps) => {
            if ("error" in data) {
              navigate("/");
              return;
            }

            const price = Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            });

            const priceCompact = Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              notation: "compact",
            });

            const resultData = {
              ...data.data,
              formatedPrice: price.format(Number(data.data.priceUsd)),
              formatedMarket: priceCompact.format(
                Number(data.data.marketCapUsd)
              ),
              formatedVolume: priceCompact.format(
                Number(data.data.volumeUsd24Hr)
              ),
            };

            setCoin(resultData);
            setLoading(false);
          });
      } catch (error) {
        console.log(error);
        navigate("/");
      }
    }
    getCoin();
  }, [cripto]);

  if (loading) {
    return (
      <div className={styles.container}>
        <h3 className={styles.center}>Carregando...</h3>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <Link to="/" className={styles.icon}>
          <BsArrowLeftCircle />
        </Link>
        {coin?.name} | {coin?.symbol}
      </h1>

      <section className={styles.content}>
        <img
          src={`https://assets.coincap.io/assets/icons/${coin?.symbol.toLowerCase()}@2x.png`}
          alt="logo cripto"
          className={styles.logo}
        />

        <h1>
          {coin?.name} | {coin?.symbol}
        </h1>
        <p>
          <strong>Preço:</strong> {coin?.formatedPrice}
        </p>

        <a>
          <strong>Mercado:</strong> {coin?.formatedMarket}
        </a>

        <a>
          <strong>Volume:</strong> {coin?.formatedVolume}
        </a>

        <a>
          <strong>Mudança 24h: </strong>
          <span
            className={`${
              Number(coin?.changePercent24Hr) > 0 ? styles.profit : styles.loss
            }`}
          >
            {Number(coin?.changePercent24Hr).toFixed(3)} %
          </span>
        </a>
      </section>
    </div>
  );
}
