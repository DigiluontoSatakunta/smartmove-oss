import Head from "next/head";
import dynamic from "next/dynamic";
import {useRef} from "react";
import {v4 as uuidv4} from "uuid";

import ResponsiveAppBar from "../components/header";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import styles from "../../styles/Home.module.css";
import {useEffect} from "react";

export default function Home() {
  const navBtnRef = useRef(null);

  const MapWithNoSSR = dynamic(() => import("../components/map"), {
    ssr: false,
  });

  const getUid = () => {
    const uid = localStorage.getItem("uid") || uuidv4();
    localStorage.setItem("uid", uid);
    return uid;
  };

  useEffect(() => {
    const uid = getUid();
  }, []);

  return (
    <div>
      <Head>
        <title>SMARTMOVE</title>
        <meta name="description" content="SMARTMOVE @ TUNI.FI" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ResponsiveAppBar navBtnRef={navBtnRef} />

      <main className={styles.main}>
        <MapWithNoSSR navBtnRef={navBtnRef} />
      </main>
    </div>
  );
}
