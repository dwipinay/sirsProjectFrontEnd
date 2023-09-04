import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { Link, useNavigate, useParams } from "react-router-dom";
import style from "./FormTambahRL4BSebab.module.css";
import { HiSaveAs } from "react-icons/hi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoArrowBack } from "react-icons/io5";
import { Table } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";

export const FormEditRL4BSebab = () => {
  // const [tahun, setTahun] = useState("");
  const [namaRS, setNamaRS] = useState("");
  const [alamatRS, setAlamatRS] = useState("");
  const [namaPropinsi, setNamaPropinsi] = useState("");
  const [namaKabKota, setNamaKabKota] = useState("");
  // const [jenisKegiatan, setJeniskegiatan] = useState("");
  // const [jumlah, setJumlah] = useState("");
  // const [dataRL, setDataRL] = useState([]);
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  // const [dataUpdate, setDataUpdate] = useState([]);

  // const [jenisGolSebabPenyakitId, setjenisGolSebabPenyakitId] = useState("");
  const [no, setNo] = useState("");
  const [nodtd, setNoDTD] = useState("");
  const [nama, setNama] = useState("");
  const [jmlhPasKasusUmurSex0hr6hrL, setpar6hrL] = useState("");
  const [jmlhPasKasusUmurSex0hr6hrP, setpar6hrP] = useState("");
  const [jmlhPasKasusUmurSex6hr28hrL, setpar28hrL] = useState("");
  const [jmlhPasKasusUmurSex6hr28hrP, setpar28hrP] = useState("");
  const [jmlhPasKasusUmurSex28hr1thL, setpar28hr1thL] = useState("");
  const [jmlhPasKasusUmurSex28hr1thP, setpar28hr1thP] = useState("");
  const [jmlhPasKasusUmurSex1th4thL, setpar14thL] = useState("");
  const [jmlhPasKasusUmurSex1th4thP, setpar14thP] = useState("");
  const [jmlhPasKasusUmurSex4th14thL, setpar414thL] = useState("");
  const [jmlhPasKasusUmurSex4th14thP, setpar414thP] = useState("");
  const [jmlhPasKasusUmurSex14th24thL, setpar1424thL] = useState("");
  const [jmlhPasKasusUmurSex14th24thP, setpar1424thP] = useState("");
  const [jmlhPasKasusUmurSex24th44thL, setpar2444thL] = useState("");
  const [jmlhPasKasusUmurSex24th44thP, setpar2444thP] = useState("");
  const [jmlhPasKasusUmurSex44th64L, setpar4464thL] = useState("");
  const [jmlhPasKasusUmurSex44th64P, setpar4464thP] = useState("");
  const [jmlhPasKasusUmurSexLebih64L, setparLebih64thL] = useState("");
  const [jmlhPasKasusUmurSexLebih64P, setparLebih64thP] = useState("");
  const [jmlhKunjungan, setjmlhPasKunjungan] = useState("");
  const [spinner, setSpinner] = useState(false);
  const [buttonStatus, setButtonStatus] = useState(false)

  useEffect(() => {
    refreshToken();
    getRLEmpatB();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const getRLEmpatB = async () => {
    setSpinner(true)
    const response = await axiosJWT.get("/apisirs/rlempatbsebab/update/" + id, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log(response.data.data);
    // setjenisGolSebabPenyakitId(response.data.data.jenisGolSebabPenyakitId);
    setNo(
      response.data.data.jenis_golongan_sebab_penyakit.no_daftar_terperinci
    );
    setNoDTD(response.data.data.jenis_golongan_sebab_penyakit.no_dtd);
    setNama(response.data.data.jenis_golongan_sebab_penyakit.nama);
    setpar6hrL(response.data.data.jmlh_pas_kasus_umur_sex_0_6hr_l);
    setpar6hrP(response.data.data.jmlh_pas_kasus_umur_sex_0_6hr_p);
    setpar28hrL(response.data.data.jmlh_pas_kasus_umur_sex_6_28hr_l);
    setpar28hrP(response.data.data.jmlh_pas_kasus_umur_sex_6_28hr_p);
    setpar28hr1thL(response.data.data.jmlh_pas_kasus_umur_sex_28hr_1th_l);
    setpar28hr1thP(response.data.data.jmlh_pas_kasus_umur_sex_28hr_1th_p);
    setpar14thL(response.data.data.jmlh_pas_kasus_umur_sex_1_4th_l);
    setpar14thP(response.data.data.jmlh_pas_kasus_umur_sex_1_4th_p);
    setpar414thL(response.data.data.jmlh_pas_kasus_umur_sex_4_14th_l);
    setpar414thP(response.data.data.jmlh_pas_kasus_umur_sex_4_14th_p);
    setpar1424thL(response.data.data.jmlh_pas_kasus_umur_sex_14_24th_l);
    setpar1424thP(response.data.data.jmlh_pas_kasus_umur_sex_14_24th_p);
    setpar2444thL(response.data.data.jmlh_pas_kasus_umur_sex_24_44th_l);
    setpar2444thP(response.data.data.jmlh_pas_kasus_umur_sex_24_44th_p);
    setpar4464thL(response.data.data.jmlh_pas_kasus_umur_sex_44_64th_l);
    setpar4464thP(response.data.data.jmlh_pas_kasus_umur_sex_44_64th_p);
    setparLebih64thL(response.data.data.jmlh_pas_kasus_umur_sex_lebih_64th_l);
    setparLebih64thP(response.data.data.jmlh_pas_kasus_umur_sex_lebih_64th_p);
    setjmlhPasKunjungan(response.data.data.jumlah_kunjungan);
    setSpinner(false)
  };

  const UpdateRLEmpatB = async (e) => {
    setButtonStatus(true)
    e.preventDefault();
    let counttotal = jmlhPasKasusUmurSex0hr6hrL+
    jmlhPasKasusUmurSex0hr6hrP+
    jmlhPasKasusUmurSex6hr28hrL+
    jmlhPasKasusUmurSex6hr28hrP+
    jmlhPasKasusUmurSex28hr1thL+
    jmlhPasKasusUmurSex28hr1thP+
    jmlhPasKasusUmurSex1th4thL+
    jmlhPasKasusUmurSex1th4thP+
    jmlhPasKasusUmurSex4th14thL+
    jmlhPasKasusUmurSex4th14thP+
    jmlhPasKasusUmurSex14th24thL+
    jmlhPasKasusUmurSex14th24thP+
    jmlhPasKasusUmurSex24th44thL+
    jmlhPasKasusUmurSex24th44thP+
    jmlhPasKasusUmurSex44th64L+
    jmlhPasKasusUmurSex44th64P+
    jmlhPasKasusUmurSexLebih64L+
    jmlhPasKasusUmurSexLebih64P;
    if (counttotal <= jmlhKunjungan) {
      try {
        const customConfig = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const varb = {
          jmlhPasKasusUmurSex0hr6hrL,
          jmlhPasKasusUmurSex0hr6hrP,
          jmlhPasKasusUmurSex6hr28hrL,
          jmlhPasKasusUmurSex6hr28hrP,
          jmlhPasKasusUmurSex28hr1thL,
          jmlhPasKasusUmurSex28hr1thP,
          jmlhPasKasusUmurSex1th4thL,
          jmlhPasKasusUmurSex1th4thP,
          jmlhPasKasusUmurSex4th14thL,
          jmlhPasKasusUmurSex4th14thP,
          jmlhPasKasusUmurSex14th24thL,
          jmlhPasKasusUmurSex14th24thP,
          jmlhPasKasusUmurSex24th44thL,
          jmlhPasKasusUmurSex24th44thP,
          jmlhPasKasusUmurSex44th64L,
          jmlhPasKasusUmurSex44th64P,
          jmlhPasKasusUmurSexLebih64L,
          jmlhPasKasusUmurSexLebih64P,
          jmlhKunjungan,
        };
        await axiosJWT.patch("/apisirs/rlempatbsebab/" + id, varb, customConfig);
        toast("Data Berhasil Diupdate", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setTimeout(() => {
          navigate("/rl4bsebab");
        }, 1000);
      } catch (error) {
        setButtonStatus(false)
        toast("Gagal!." + error.response.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } else {
      toast(`Data Gagal Disimpan, Data Jumlah Kunjungan Kurang Dari Jumlah Kasus Baru`, {
        position: toast.POSITION.TOP_RIGHT
      })
      setButtonStatus(false)
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

  const changeHandler = (event, index) => {
    // if (event.target.value === '') {
    //   event.target.value = 0
    //   event.target.select(event.target.value)
    // }
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
      case "jmlhPasHidupMatiUmurSe28hrP":
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

      case "jmlhkunjungan":
        if (event.target.value === "") {
          event.target.value = 0;
          event.target.select(event.target.value);
        }
        setjmlhPasKunjungan(parseInt(event.target.value));
        break;

      default:
        console.log(event.target.name);
        break;
    }
  };

  const handleFocus = (event) => {
    event.target.select();
  };

  const maxLengthCheck = (object) => {
    if (object.target.value.length > object.target.maxLength) {
      object.target.value = object.target.value.slice(0, object.target.maxLength)
    }
  }

  return (
    <div className="container" style={{ marginTop: "70px" }}>
      <form onSubmit={UpdateRLEmpatB}>
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
            {/* <Link to={`/rl4bsebab/`} style={{ textDecoration: "none" }}>
              <IoArrowBack
                size={30}
                style={{ color: "gray", cursor: "pointer" }}
              />
              <span style={{ color: "gray" }}>RL 4 B Data Keadaan Morbiditas Pasien Rawat Jalan Rumah Sakit
              Penyebab Kecelakaan</span>
            </Link> */}
            <Link to={`/rl4bsebab/`} className='btn btn-info' style={{fontSize:"18px", backgroundColor: "#779D9E", color: "#FFFFFF"}}>
              &lt;
            </Link>
            <span style={{ color: "gray" }}> Kembali RL 4B Penyakit Rawat Jalan Sebab Luar</span>
            <h5>UBAH DATA RL 4B Sebab</h5>
            <h6>Detail Penyakit</h6>
            <h6>No. Jenis Golongan Penyakit : {no}</h6>
            <h6>No. DTD Penyakit : {nodtd}</h6>
            <h6>Nama Penyakit : {nama}</h6>
            <div className="container" style={{ textAlign: "center" }}>
                        {/* <h5>test</h5> */}
                        {spinner && <Spinner animation="grow" variant="success"></Spinner>}
                        {spinner && <Spinner animation="grow" variant="success"></Spinner>}
                        {spinner && <Spinner animation="grow" variant="success"></Spinner>}
                        {spinner && <Spinner animation="grow" variant="success"></Spinner>}
                        {spinner && <Spinner animation="grow" variant="success"></Spinner>}
                        {spinner && <Spinner animation="grow" variant="success"></Spinner>}
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
                      value={jmlhPasKasusUmurSex0hr6hrL}
                      // onChange={(e) =>  setpar6hrL(parseInt(e.target.value))}
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
                      value={jmlhPasKasusUmurSex0hr6hrP}
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
                      value={jmlhPasKasusUmurSex6hr28hrL}
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
                      name="jmlhPasHidupMatiUmurSe28hrP"
                      className="form-control"
                      value={jmlhPasKasusUmurSex6hr28hrP}
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
                  <td>29hr - 1thn</td>
                  <td>
                    <input
                      type="number"
                      name="jmlhPasHidupMatiUmurSex28hr1thL"
                      className="form-control"
                      value={jmlhPasKasusUmurSex28hr1thL}
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
                      value={jmlhPasKasusUmurSex28hr1thP}
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
                      value={jmlhPasKasusUmurSex1th4thL}
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
                      value={jmlhPasKasusUmurSex1th4thP}
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
                      value={jmlhPasKasusUmurSex4th14thL}
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
                      value={jmlhPasKasusUmurSex4th14thP}
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
                      value={jmlhPasKasusUmurSex14th24thL}
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
                      value={jmlhPasKasusUmurSex14th24thP}
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
                      value={jmlhPasKasusUmurSex24th44thL}
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
                      value={jmlhPasKasusUmurSex24th44thP}
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
                      value={jmlhPasKasusUmurSex44th64L}
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
                      value={jmlhPasKasusUmurSex44th64P}
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
                  <td>Lebih Dari 64th</td>
                  <td>
                    <input
                      type="number"
                      name="jmlhPasHidupMatiUmurSexLebih64thL"
                      className="form-control"
                      value={jmlhPasKasusUmurSexLebih64L}
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
                      value={jmlhPasKasusUmurSexLebih64P}
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
                  <td>Jumlah Kunjungan</td>

                  <td colSpan={2}>
                    <input
                      type="number"
                      name="jmlhkunjungan"
                      className="form-control"
                      value={jmlhKunjungan}
                      // onChange={(e) =>
                      //   setjmlhPasKunjungan(parseInt(e.target.value))
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
              <button type="submit" disabled={buttonStatus} className="btn btn-outline-success">
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
