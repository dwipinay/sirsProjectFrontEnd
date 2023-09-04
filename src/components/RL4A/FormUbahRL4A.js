import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { Link, useNavigate, useParams } from "react-router-dom";
import style from "./FormTambahRL4a.module.css";
import { HiSaveAs } from "react-icons/hi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { IoArrowBack } from "react-icons/io5";
import { Spinner, Table } from "react-bootstrap";

export const FormUbahRL4A = () => {
  const [namaRS, setNamaRS] = useState("");
  const [alamatRS, setAlamatRS] = useState("");
  const [namaPropinsi, setNamaPropinsi] = useState("");
  const [namaKabKota, setNamaKabKota] = useState("");
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const [buttonStatus, setButtonStatus] = useState(false);
  const [spinner, setSpinner] = useState(false);

  const [no, setNo] = useState("");
  const [nodtd, setNoDTD] = useState("");
  const [nama, setNama] = useState("");
  const [par6hrL, setpar6hrL] = useState("");
  const [par6hrP, setpar6hrP] = useState("");
  const [par28hrL, setpar28hrL] = useState("");
  const [par28hrP, setpar28hrP] = useState("");
  const [par28hr1thL, setpar28hr1thL] = useState("");
  const [par28hr1thP, setpar28hr1thP] = useState("");
  const [par14thL, setpar14thL] = useState("");
  const [par14thP, setpar14thP] = useState("");
  const [par414thL, setpar414thL] = useState("");
  const [par414thP, setpar414thP] = useState("");
  const [par1424thL, setpar1424thL] = useState("");
  const [par1424thP, setpar1424thP] = useState("");
  const [par2444thL, setpar2444thL] = useState("");
  const [par2444thP, setpar2444thP] = useState("");
  const [par4464thL, setpar4464thL] = useState("");
  const [par4464thP, setpar4464thP] = useState("");
  const [parLebih64thL, setparLebih64thL] = useState("");
  const [parLebih64thP, setparLebih64thP] = useState("");
  const [jmlhPasKeluarMati, setjmlhPasKeluarMati] = useState("");

  useEffect(() => {
    refreshToken();
    getRLEmpatA();
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get("/apisirs/token");
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setExpire(decoded.exp);
      getDataRS(decoded.rsId);
    } catch (error) {
      if (error.response) {
        navigate("/");
      }
    }
  };

  const axiosJWT = axios.create();
  axiosJWT.interceptors.request.use(
    async (config) => {
      const currentDate = new Date();
      if (expire * 1000 < currentDate.getTime()) {
        const response = await axios.get("/apisirs/token");
        config.headers.Authorization = `Bearer ${response.data.accessToken}`;
        setToken(response.data.accessToken);
        const decoded = jwt_decode(response.data.accessToken);
        setExpire(decoded.exp);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const getDataRS = async (id) => {
    try {
      const response = await axiosJWT.get("/apisirs/rumahsakit/" + id, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNamaRS(response.data.data[0].nama);
      setAlamatRS(response.data.data[0].alamat);
      setNamaPropinsi(response.data.data[0].propinsi.nama);
      setNamaKabKota(response.data.data[0].kabKota.nama);
    } catch (error) {}
  };

  const getRLEmpatA = async () => {
    setSpinner(true);
    const response = await axiosJWT.get("/apisirs/rlempata/" + id, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setNo(response.data.data.jenis_gol_sebab_penyakit.no);
    setNoDTD(response.data.data.jenis_gol_sebab_penyakit.no_dtd);
    setNama(response.data.data.jenis_gol_sebab_penyakit.nama);
    setpar6hrL(response.data.data.jmlh_pas_hidup_mati_umur_sex_0_6hr_l);
    setpar6hrP(response.data.data.jmlh_pas_hidup_mati_umur_sex_0_6hr_p);
    setpar28hrL(response.data.data.jmlh_pas_hidup_mati_umur_sex_6_28hr_l);
    setpar28hrP(response.data.data.jmlh_pas_hidup_mati_umur_sex_6_28hr_p);
    setpar28hr1thL(response.data.data.jmlh_pas_hidup_mati_umur_sex_28hr_1th_l);
    setpar28hr1thP(response.data.data.jmlh_pas_hidup_mati_umur_sex_28hr_1th_p);
    setpar14thL(response.data.data.jmlh_pas_hidup_mati_umur_sex_1_4th_l);
    setpar14thP(response.data.data.jmlh_pas_hidup_mati_umur_sex_1_4th_p);
    setpar414thL(response.data.data.jmlh_pas_hidup_mati_umur_sex_4_14th_l);
    setpar414thP(response.data.data.jmlh_pas_hidup_mati_umur_sex_4_14th_p);
    setpar1424thL(response.data.data.jmlh_pas_hidup_mati_umur_sex_14_24th_l);
    setpar1424thP(response.data.data.jmlh_pas_hidup_mati_umur_sex_14_24th_p);
    setpar2444thL(response.data.data.jmlh_pas_hidup_mati_umur_sex_24_44th_l);
    setpar2444thP(response.data.data.jmlh_pas_hidup_mati_umur_sex_24_44th_p);
    setpar4464thL(response.data.data.jmlh_pas_hidup_mati_umur_sex_44_64th_l);
    setpar4464thP(response.data.data.jmlh_pas_hidup_mati_umur_sex_44_64th_p);
    setparLebih64thL(
      response.data.data.jmlh_pas_hidup_mati_umur_sex_lebih_64th_l
    );
    setparLebih64thP(
      response.data.data.jmlh_pas_hidup_mati_umur_sex_lebih_64th_p
    );
    setjmlhPasKeluarMati(response.data.data.jmlh_pas_keluar_mati);
    setSpinner(false);
  };

  const UpdateRLEmpatA = async (e) => {
    e.preventDefault();
    setButtonStatus(true);
    const akumulasi =  par6hrL+
    par6hrP+
    par28hrL+
    par28hrP+
    par28hr1thL+
    par28hr1thP+
    par14thL+
    par14thP+
    par414thL+
    par414thP+
    par1424thL+
    par1424thP+
    par2444thL+
    par2444thP+
    par4464thL+
    par4464thP+
    parLebih64thL+
    parLebih64thP;
    if (jmlhPasKeluarMati <= akumulasi){
    try {
      const customConfig = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const varb = {
        par6hrL,
        par6hrP,
        par28hrL,
        par28hrP,
        par28hr1thL,
        par28hr1thP,
        par14thL,
        par14thP,
        par414thL,
        par414thP,
        par1424thL,
        par1424thP,
        par2444thL,
        par2444thP,
        par4464thL,
        par4464thP,
        parLebih64thL,
        parLebih64thP,
        jmlhPasKeluarMati,
      };
      console.log(varb);
      await axiosJWT.patch("/apisirs/rlempata/" + id, varb, customConfig);
      toast("Data Berhasil Diupdate", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setTimeout(() => {
        navigate("/rl4a");
      }, 1000);
    } catch (error) {
      toast("Data Gagal Diupdate, " + error.response.data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setButtonStatus(false);
    }
  }else{
    toast(`Data Gagal Disimpan, Data Jumlah Pasien Keluar Mati Lebih Dari Jumlah Pasien Hidup dan Mati`, {
      position: toast.POSITION.TOP_RIGHT,
    });
    setButtonStatus(false);
  }
  };

  const preventPasteNegative = (e) => {
    const clipboardData = e.clipboardData || window.clipboardData;
    const pastedData = parseFloat(clipboardData.getData("text"));

    if (pastedData < 0) {
      e.preventDefault();
    }
  };

  const preventMinus = (e) => {
    if (e.code === "Minus") {
      e.preventDefault();
    }
  };

  const handleFocus = (event) => {
    event.target.select();
  };

  const changeHandler = (event, index) => {
    switch (event.target.name) {
      case "jmlhPasHidupMatiUmurSex6hrL":
        if (event.target.value === "") {
          event.target.value = 0;
          event.target.select(event.target.value);
        }
        setpar6hrL(parseInt(event.target.value));
        break;
      case "jmlhPasHidupMatiUmurSex6hrP":
        if (event.target.value === "") {
          event.target.value = 0;
          event.target.select(event.target.value);
        }
        setpar6hrP(parseInt(event.target.value));
        break;
      case "jmlhPasHidupMatiUmurSex28hrL":
        if (event.target.value === "") {
          event.target.value = 0;
          event.target.select(event.target.value);
        }
        setpar28hrL(parseInt(event.target.value));
        break;
      case "jmlhPasHidupMatiUmurSex28hrP":
        if (event.target.value === "") {
          event.target.value = 0;
          event.target.select(event.target.value);
        }
        setpar28hrP(parseInt(event.target.value));
        break;
      case "jmlhPasHidupMatiUmurSex28hr1thL":
        if (event.target.value === "") {
          event.target.value = 0;
          event.target.select(event.target.value);
        }
        setpar28hr1thL(parseInt(event.target.value));
        break;
      case "jmlhPasHidupMatiUmurSex28h1thP":
        if (event.target.value === "") {
          event.target.value = 0;
          event.target.select(event.target.value);
        }
        setpar28hr1thP(parseInt(event.target.value));
        break;
      case "jmlhPasHidupMatiUmurSex14thL":
        if (event.target.value === "") {
          event.target.value = 0;
          event.target.select(event.target.value);
        }
        setpar14thL(parseInt(event.target.value));
        break;
      case "jmlhPasHidupMatiUmurSex14thP":
        if (event.target.value === "") {
          event.target.value = 0;
          event.target.select(event.target.value);
        }
        setpar14thP(parseInt(event.target.value));
        break;

      case "jmlhPasHidupMatiUmurSex414thL":
        if (event.target.value === "") {
          event.target.value = 0;
          event.target.select(event.target.value);
        }
        setpar414thL(parseInt(event.target.value));
        break;
      case "jmlhPasHidupMatiUmurSex414thP":
        if (event.target.value === "") {
          event.target.value = 0;
          event.target.select(event.target.value);
        }
        setpar414thP(parseInt(event.target.value));
        break;

      case "jmlhPasHidupMatiUmurSex1424thL":
        if (event.target.value === "") {
          event.target.value = 0;
          event.target.select(event.target.value);
        }
        setpar1424thL(parseInt(event.target.value));
        break;
      case "jmlhPasHidupMatiUmurSex1424thP":
        if (event.target.value === "") {
          event.target.value = 0;
          event.target.select(event.target.value);
        }
        setpar1424thP(parseInt(event.target.value));
        break;

      case "jmlhPasHidupMatiUmurSex2444thL":
        if (event.target.value === "") {
          event.target.value = 0;
          event.target.select(event.target.value);
        }
        setpar2444thL(parseInt(event.target.value));
        break;
      case "jmlhPasHidupMatiUmurSex2444thP":
        if (event.target.value === "") {
          event.target.value = 0;
          event.target.select(event.target.value);
        }
        setpar2444thP(parseInt(event.target.value));
        break;

      case "jmlhPasHidupMatiUmurSex4464thL":
        if (event.target.value === "") {
          event.target.value = 0;
          event.target.select(event.target.value);
        }
        setpar4464thL(parseInt(event.target.value));
        break;
      case "jmlhPasHidupMatiUmurSex4464thP":
        if (event.target.value === "") {
          event.target.value = 0;
          event.target.select(event.target.value);
        }
        setpar4464thP(parseInt(event.target.value));
        break;

      case "jmlhPasHidupMatiUmurSexLebih64thL":
        if (event.target.value === "") {
          event.target.value = 0;
          event.target.select(event.target.value);
        }
        setparLebih64thL(parseInt(event.target.value));
        break;

      case "jmlhPasHidupMatiUmurSexLebih64thP":
        if (event.target.value === "") {
          event.target.value = 0;
          event.target.select(event.target.value);
        }
        setparLebih64thP(parseInt(event.target.value));
        break;

      case "jmlhPasKeluarMati":
        if (event.target.value === "") {
          event.target.value = 0;
          event.target.select(event.target.value);
        }
        setjmlhPasKeluarMati(parseInt(event.target.value));
        break;

      default:
        console.log(event.target.name);
        break;
    }
  };

  const maxLengthCheck = (object) => {
    if (object.target.value.length > object.target.maxLength) {
      object.target.value = object.target.value.slice(0, object.target.max);
    }
  };

  return (
    <div className="container" style={{ marginTop: "70px" }}>
      <form onSubmit={UpdateRLEmpatA}>
        <div className="row">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title h5">Profile Fasyankes</h5>
                <div
                  className="form-floating"
                  style={{ width: "100%", display: "inline-block" }}
                >
                  <input
                    type="text"
                    className="form-control"
                    id="floatingInput"
                    value={namaRS}
                    disabled={true}
                  />
                  <label htmlFor="floatingInput">Nama</label>
                </div>
                <div
                  className="form-floating"
                  style={{ width: "100%", display: "inline-block" }}
                >
                  <input
                    type="text"
                    className="form-control"
                    id="floatingInput"
                    value={alamatRS}
                    disabled={true}
                  />
                  <label htmlFor="floatingInput">Alamat</label>
                </div>
                <div
                  className="form-floating"
                  style={{ width: "50%", display: "inline-block" }}
                >
                  <input
                    type="text"
                    className="form-control"
                    id="floatingInput"
                    value={namaPropinsi}
                    disabled={true}
                  />
                  <label htmlFor="floatingInput">Provinsi </label>
                </div>
                <div
                  className="form-floating"
                  style={{ width: "50%", display: "inline-block" }}
                >
                  <input
                    type="text"
                    className="form-control"
                    id="floatingInput"
                    value={namaKabKota}
                    disabled={true}
                  />
                  <label htmlFor="floatingInput">Kab/Kota</label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-3 mb-3">
          <div className="col-md-12">
            <Link to={`/rl4a/`} className='btn btn-info' style={{fontSize:"18px", backgroundColor: "#779D9E", color: "#FFFFFF"}}>
              {/* <IoArrowBack
                size={30}
                style={{ color: "gray", cursor: "pointer" }}
              /> */}
              &lt;
            </Link>
              <span style={{ color: "gray" }}> Kembali RL 4A Penyakit Rawat Inap</span>
            <h6>Detail Penyakit :</h6>
            <h6>No. Jenis Golongan Penyakit : {no}</h6>
            <h6>No. DTD Penyakit : {nodtd}</h6>
            <h6>Nama Penyakit : {nama}</h6>
            <div className="container" style={{ textAlign: "center" }}>
              {/* <h5>test</h5> */}
              {spinner && (
                <Spinner animation="grow" variant="success"></Spinner>
              )}
              {spinner && (
                <Spinner animation="grow" variant="success"></Spinner>
              )}
              {spinner && (
                <Spinner animation="grow" variant="success"></Spinner>
              )}
              {spinner && (
                <Spinner animation="grow" variant="success"></Spinner>
              )}
              {spinner && (
                <Spinner animation="grow" variant="success"></Spinner>
              )}
              {spinner && (
                <Spinner animation="grow" variant="success"></Spinner>
              )}
            </div>
            <Table className={style.rlTable} style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Golongan Berdasarkan Umur</th>
                  <th>Laki Laki</th>
                  <th>Perempuan</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>0hr - 6hr</td>
                  <td>
                    <input
                      type="number"
                      name="jmlhPasHidupMatiUmurSex6hrL"
                      className="form-control"
                      value={par6hrL}
                      // onChange={(e) => setpar6hrL(parseInt(e.target.value))}
                      placeholder="Jumlah"
                      min={0}
                      maxLength={7}
                      onInput={(e) => maxLengthCheck(e)}
                      onPaste={preventPasteNegative}
                      onKeyPress={preventMinus}
                      onFocus={handleFocus}
                      onChange={(e) => changeHandler(e)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="jmlhPasHidupMatiUmurSex6hrP"
                      className="form-control"
                      value={par6hrP}
                      // onChange={(e) => setpar6hrP(parseInt(e.target.value))}
                      placeholder="Jumlah"
                      min={0}
                      maxLength={7}
                      onInput={(e) => maxLengthCheck(e)}
                      onPaste={preventPasteNegative}
                      onKeyPress={preventMinus}
                      onFocus={handleFocus}
                      onChange={(e) => changeHandler(e)}
                    />
                  </td>
                </tr>

                <tr>
                  <td>7hr - 28hr</td>
                  <td>
                    <input
                      type="number"
                      name="jmlhPasHidupMatiUmurSex28hrL"
                      className="form-control"
                      value={par28hrL}
                      // onChange={(e) => setpar28hrL(parseInt(e.target.value))}
                      placeholder="Jumlah"
                      min={0}
                      maxLength={7}
                      onInput={(e) => maxLengthCheck(e)}
                      onPaste={preventPasteNegative}
                      onKeyPress={preventMinus}
                      onFocus={handleFocus}
                      onChange={(e) => changeHandler(e)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="jmlhPasHidupMatiUmurSex28hrP"
                      className="form-control"
                      value={par28hrP}
                      // onChange={(e) => setpar28hrP(parseInt(e.target.value))}
                      placeholder="Jumlah"
                      min={0}
                      maxLength={7}
                      onInput={(e) => maxLengthCheck(e)}
                      onPaste={preventPasteNegative}
                      onKeyPress={preventMinus}
                      onFocus={handleFocus}
                      onChange={(e) => changeHandler(e)}
                    />
                  </td>
                </tr>

                <tr>
                  <td>29hr - &lt; 1thn</td>
                  <td>
                    <input
                      type="number"
                      name="jmlhPasHidupMatiUmurSex28hr1thL"
                      className="form-control"
                      value={par28hr1thL}
                      // onChange={(e) => setpar28hr1thL(parseInt(e.target.value))}
                      placeholder="Jumlah"
                      min={0}
                      maxLength={7}
                      onInput={(e) => maxLengthCheck(e)}
                      onPaste={preventPasteNegative}
                      onKeyPress={preventMinus}
                      onFocus={handleFocus}
                      onChange={(e) => changeHandler(e)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="jmlhPasHidupMatiUmurSex28h1thP"
                      className="form-control"
                      value={par28hr1thP}
                      // onChange={(e) => setpar28hr1thP(parseInt(e.target.value))}
                      placeholder="Jumlah"
                      min={0}
                      maxLength={7}
                      onInput={(e) => maxLengthCheck(e)}
                      onPaste={preventPasteNegative}
                      onKeyPress={preventMinus}
                      onFocus={handleFocus}
                      onChange={(e) => changeHandler(e)}
                    />
                  </td>
                </tr>

                <tr>
                  <td>1th - 4th</td>
                  <td>
                    <input
                      type="number"
                      name="jmlhPasHidupMatiUmurSex14thL"
                      className="form-control"
                      value={par14thL}
                      // onChange={(e) => setpar14thL(parseInt(e.target.value))}
                      placeholder="Jumlah"
                      min={0}
                      maxLength={7}
                      onInput={(e) => maxLengthCheck(e)}
                      onPaste={preventPasteNegative}
                      onKeyPress={preventMinus}
                      onFocus={handleFocus}
                      onChange={(e) => changeHandler(e)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="jmlhPasHidupMatiUmurSex14thP"
                      className="form-control"
                      value={par14thP}
                      // onChange={(e) => setpar14thP(parseInt(e.target.value))}
                      placeholder="Jumlah"
                      min={0}
                      maxLength={7}
                      onInput={(e) => maxLengthCheck(e)}
                      onPaste={preventPasteNegative}
                      onKeyPress={preventMinus}
                      onFocus={handleFocus}
                      onChange={(e) => changeHandler(e)}
                    />
                  </td>
                </tr>

                <tr>
                  <td>5th - 14th</td>
                  <td>
                    <input
                      type="number"
                      name="jmlhPasHidupMatiUmurSex414thL"
                      className="form-control"
                      value={par414thL}
                      // onChange={(e) => setpar414thL(parseInt(e.target.value))}
                      placeholder="Jumlah"
                      min={0}
                      maxLength={7}
                      onInput={(e) => maxLengthCheck(e)}
                      onPaste={preventPasteNegative}
                      onKeyPress={preventMinus}
                      onFocus={handleFocus}
                      onChange={(e) => changeHandler(e)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="jmlhPasHidupMatiUmurSex414thP"
                      className="form-control"
                      value={par414thP}
                      // onChange={(e) => setpar414thP(parseInt(e.target.value))}
                      placeholder="Jumlah"
                      min={0}
                      maxLength={7}
                      onInput={(e) => maxLengthCheck(e)}
                      onPaste={preventPasteNegative}
                      onKeyPress={preventMinus}
                      onFocus={handleFocus}
                      onChange={(e) => changeHandler(e)}
                    />
                  </td>
                </tr>

                <tr>
                  <td>15th - 24th</td>
                  <td>
                    <input
                      type="number"
                      name="jmlhPasHidupMatiUmurSex1424thL"
                      className="form-control"
                      value={par1424thL}
                      // onChange={(e) => setpar1424thL(parseInt(e.target.value))}
                      placeholder="Jumlah"
                      min={0}
                      maxLength={7}
                      onInput={(e) => maxLengthCheck(e)}
                      onPaste={preventPasteNegative}
                      onKeyPress={preventMinus}
                      onFocus={handleFocus}
                      onChange={(e) => changeHandler(e)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="jmlhPasHidupMatiUmurSex1424thP"
                      className="form-control"
                      value={par1424thP}
                      // onChange={(e) => setpar1424thP(parseInt(e.target.value))}
                      placeholder="Jumlah"
                      min={0}
                      maxLength={7}
                      onInput={(e) => maxLengthCheck(e)}
                      onPaste={preventPasteNegative}
                      onKeyPress={preventMinus}
                      onFocus={handleFocus}
                      onChange={(e) => changeHandler(e)}
                    />
                  </td>
                </tr>

                <tr>
                  <td>25th - 44th</td>
                  <td>
                    <input
                      type="number"
                      name="jmlhPasHidupMatiUmurSex2444thL"
                      className="form-control"
                      value={par2444thL}
                      // onChange={(e) => setpar2444thL(parseInt(e.target.value))}
                      placeholder="Jumlah"
                      min={0}
                      maxLength={7}
                      onInput={(e) => maxLengthCheck(e)}
                      onPaste={preventPasteNegative}
                      onKeyPress={preventMinus}
                      onFocus={handleFocus}
                      onChange={(e) => changeHandler(e)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="jmlhPasHidupMatiUmurSex2444thP"
                      className="form-control"
                      value={par2444thP}
                      // onChange={(e) => setpar2444thP(parseInt(e.target.value))}
                      placeholder="Jumlah"
                      min={0}
                      maxLength={7}
                      onInput={(e) => maxLengthCheck(e)}
                      onPaste={preventPasteNegative}
                      onKeyPress={preventMinus}
                      onFocus={handleFocus}
                      onChange={(e) => changeHandler(e)}
                    />
                  </td>
                </tr>

                <tr>
                  <td>45th - 64th</td>
                  <td>
                    <input
                      type="number"
                      name="jmlhPasHidupMatiUmurSex4464thL"
                      className="form-control"
                      value={par4464thL}
                      // onChange={(e) => setpar4464thL(parseInt(e.target.value))}
                      placeholder="Jumlah"
                      min={0}
                      maxLength={7}
                      onInput={(e) => maxLengthCheck(e)}
                      onPaste={preventPasteNegative}
                      onKeyPress={preventMinus}
                      onFocus={handleFocus}
                      onChange={(e) => changeHandler(e)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="jmlhPasHidupMatiUmurSex4464thP"
                      className="form-control"
                      value={par4464thP}
                      // onChange={(e) => setpar4464thP(parseInt(e.target.value))}
                      placeholder="Jumlah"
                      min={0}
                      maxLength={7}
                      onInput={(e) => maxLengthCheck(e)}
                      onPaste={preventPasteNegative}
                      onKeyPress={preventMinus}
                      onFocus={handleFocus}
                      onChange={(e) => changeHandler(e)}
                    />
                  </td>
                </tr>

                <tr>
                  <td>Lebih Dari 65th</td>
                  <td>
                    <input
                      type="number"
                      name="jmlhPasHidupMatiUmurSexLebih64thL"
                      className="form-control"
                      value={parLebih64thL}
                      // onChange={(e) =>
                      //   setparLebih64thL(parseInt(e.target.value))
                      // }
                      placeholder="Jumlah"
                      min={0}
                      maxLength={7}
                      onInput={(e) => maxLengthCheck(e)}
                      onPaste={preventPasteNegative}
                      onKeyPress={preventMinus}
                      onFocus={handleFocus}
                      onChange={(e) => changeHandler(e)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="jmlhPasHidupMatiUmurSexLebih64thP"
                      className="form-control"
                      value={parLebih64thP}
                      // onChange={(e) =>
                      //   setparLebih64thP(parseInt(e.target.value))
                      // }
                      placeholder="Jumlah"
                      min={0}
                      maxLength={7}
                      onInput={(e) => maxLengthCheck(e)}
                      onPaste={preventPasteNegative}
                      onKeyPress={preventMinus}
                      onFocus={handleFocus}
                      onChange={(e) => changeHandler(e)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Jumlah Pasien Keluar Mati</td>

                  <td colSpan={2}>
                    <input
                      type="number"
                      name="jmlhPasKeluarMati"
                      className="form-control"
                      value={jmlhPasKeluarMati}
                      // onChange={(e) =>
                      //   setjmlhPasKeluarMati(parseInt(e.target.value))
                      // }
                      placeholder="Jumlah"
                      min={0}
                      maxLength={7}
                      onInput={(e) => maxLengthCheck(e)}
                      onPaste={preventPasteNegative}
                      onKeyPress={preventMinus}
                      onFocus={handleFocus}
                      onChange={(e) => changeHandler(e)}
                    />
                  </td>
                </tr>
              </tbody>
            </Table>
            <div className="mt-3 mb-3">
              <ToastContainer />
              <button
                type="submit"
                className="btn btn-outline-success"
                disabled={buttonStatus}
              >
                <HiSaveAs /> Simpan
              </button>
            </div>
            {/* )} */}
          </div>
        </div>
      </form>
    </div>
  );
};