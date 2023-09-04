import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
import style from "./FormTambahRL4a.module.css";
import { HiSaveAs } from "react-icons/hi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Table from "react-bootstrap/Table";
import { IoArrowBack } from "react-icons/io5";
import { Spinner } from "react-bootstrap";

const FormTambahRL4A = () => {
  const [tahun, setTahun] = useState(new Date().getFullYear() - 1);
  const [namaRS, setNamaRS] = useState("");
  const [alamatRS, setAlamatRS] = useState("");
  const [namaPropinsi, setNamaPropinsi] = useState("");
  const [namaKabKota, setNamaKabKota] = useState("");
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [caripenyakit, setCariPenyakit] = useState("");
  const [dataPenyakit, setDataPenyakit] = useState([]);
  const [datainput, setDataInput] = useState([]);
  const [buttonStatus, setButtonStatus] = useState(false);
  const [spinnerSearch, setSpinnerSearch] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datainput]);

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
      console.log(response.data);
      setNamaRS(response.data.data[0].nama);
      setAlamatRS(response.data.data[0].alamat);
      setNamaPropinsi(response.data.data[0].propinsi.nama);
      setNamaKabKota(response.data.data[0].kabKota.nama);
    } catch (error) { }
  };

  const CariPenyakit = async (e) => {
    e.preventDefault();
    setSpinnerSearch(true);
    try {
      const response = await axiosJWT.get(
        "/apisirs/jenisgolsebabpenyakita/cari?search=" + caripenyakit,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const rlEmpatPenyakit = response.data.data.map((value) => {
        return value;
      });

      let dataRLEmpatDaftarPenyakit = [];
      rlEmpatPenyakit.forEach((element) => {
        dataRLEmpatDaftarPenyakit.push(element);
      });

      setDataPenyakit(dataRLEmpatDaftarPenyakit);
      setSpinnerSearch(false);
    } catch (error) {
      console.log(error);
    }
  };

  const changeHandlerSingle = (event) => {
    setTahun(event.target.value);
  };

  const handleFocus = (event) => {
    event.target.select();
  };

  const changeHandler = (event, index) => {
    if (event.target.value === "") {
      event.target.value = 0;
      event.target.select(event.target.value);
    }
  };

  const DetailPenyakit = async (id) => {
    setSpinner(true);
    try {
      const response = await axiosJWT.get(
        "/apisirs/jenisgolsebabpenyakita/id?id=" + id,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const DetailPenyakitTemplate = response.data.data.map((value) => {
        return {
          id: value.id,
          namaPenyakit: value.nama,
          gender: value.gender,
          jumlahkunjugan: 0,
          label: [
            {
              label: "Umur 0 - 6 Hari",
              JumlahPasienL: 0,
              namaL: "jmlhPasHidupMatiUmurSex6hrL",
              JumlahPasienP: 0,
              namaP: "jmlhPasHidupMatiUmurSex6hrP",
            },
            {
              label: "Umur 7 - 28 Hari",
              JumlahPasienL: 0,
              JumlahPasienP: 0,
              namaL: "jmlhPasHidupMatiUmurSex28hrL",
              namaP: "jmlhPasHidupMatiUmurSex28hrP",
            },
            {
              label: "Umur 29 hari - < 1 tahun ",
              JumlahPasienL: 0,
              JumlahPasienP: 0,
              namaL: "jmlhPasHidupMatiUmurSex28hr1thL",
              namaP: "jmlhPasHidupMatiUmurSex28hr1thP",
            },
            {
              label: "Umur 1 - 4 tahun",
              JumlahPasienL: 0,
              JumlahPasienP: 0,
              namaL: "jmlhPasHidupMatiUmurSex14thL",
              namaP: "jmlhPasHidupMatiUmurSex14thP",
            },
            {
              label: "Umur 5 - 14 tahun",
              JumlahPasienL: 0,
              JumlahPasienP: 0,
              namaL: "jmlhPasHidupMatiUmurSex414thL",
              namaP: "jmlhPasHidupMatiUmurSex414thP",
            },
            {
              label: "Umur 15 - 24 tahun",
              JumlahPasienL: 0,
              JumlahPasienP: 0,
              namaL: "jmlhPasHidupMatiUmurSex1424thL",
              namaP: "jmlhPasHidupMatiUmurSex1424thP",
            },
            {
              label: "Umur 25 - 44 tahun",
              JumlahPasienL: 0,
              JumlahPasienP: 0,
              namaL: "jmlhPasHidupMatiUmurSex2444thL",
              namaP: "jmlhPasHidupMatiUmurSex2444thP",
            },
            {
              label: "Umur 45 - 64 tahun",
              JumlahPasienL: 0,
              JumlahPasienP: 0,
              namaL: "jmlhPasHidupMatiUmurSex4464thL",
              namaP: "jmlhPasHidupMatiUmurSex4464thP",
            },
            {
              label: "Umur >= 65 tahun",
              JumlahPasienL: 0,
              JumlahPasienP: 0,
              namaL: "jmlhPasHidupMatiUmurSexLebih64thL",
              namaP: "jmlhPasHidupMatiUmurSexLebih64thP",
            },
          ],
        };
      });
      setDataInput(DetailPenyakitTemplate);
      setSpinner(false);
    } catch (error) {
      console.log(error);
    }
  };

  const changeHandlerCariPenyakit = (event) => {
    setCariPenyakit(event.target.value);
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

  const Simpan = async (e) => {
    e.preventDefault();
    setButtonStatus(true);

    const akumulasi = parseInt(e.target[2].value) +
      parseInt(e.target[3].value) +
      parseInt(e.target[4].value) +
      parseInt(e.target[5].value) +
      parseInt(e.target[6].value) +
      parseInt(e.target[7].value) +
      parseInt(e.target[8].value) +
      parseInt(e.target[9].value) +
      parseInt(e.target[10].value) +
      parseInt(e.target[11].value) +
      parseInt(e.target[12].value) +
      parseInt(e.target[13].value) +
      parseInt(e.target[14].value) +
      parseInt(e.target[15].value) +
      parseInt(e.target[16].value) +
      parseInt(e.target[17].value) +
      parseInt(e.target[18].value) +
      parseInt(e.target[19].value);
    if (e.target[20].value <= akumulasi) {
      try {
        const customConfig = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };



        const result = await axiosJWT.post(
          "/apisirs/rlempata",
          {
            tahun: parseInt(e.target[0].value),
            data: [
              {
                jenisGolSebabPenyakitId: parseInt(e.target[1].value),
                jmlhPasHidupMatiUmurSex6hrL: parseInt(e.target[2].value),
                jmlhPasHidupMatiUmurSex6hrP: parseInt(e.target[3].value),
                jmlhPasHidupMatiUmurSex28hrL: parseInt(e.target[4].value),
                jmlhPasHidupMatiUmurSex28hrP: parseInt(e.target[5].value),
                jmlhPasHidupMatiUmurSex28hr1thL: parseInt(e.target[6].value),
                jmlhPasHidupMatiUmurSex28hr1thP: parseInt(e.target[7].value),
                jmlhPasHidupMatiUmurSex14thL: parseInt(e.target[8].value),
                jmlhPasHidupMatiUmurSex14thP: parseInt(e.target[9].value),
                jmlhPasHidupMatiUmurSex414thL: parseInt(e.target[10].value),
                jmlhPasHidupMatiUmurSex414thP: parseInt(e.target[11].value),
                jmlhPasHidupMatiUmurSex1424thL: parseInt(e.target[12].value),
                jmlhPasHidupMatiUmurSex1424thP: parseInt(e.target[13].value),
                jmlhPasHidupMatiUmurSex2444thL: parseInt(e.target[14].value),
                jmlhPasHidupMatiUmurSex2444thP: parseInt(e.target[15].value),
                jmlhPasHidupMatiUmurSex4464thL: parseInt(e.target[16].value),
                jmlhPasHidupMatiUmurSex4464thP: parseInt(e.target[17].value),
                jmlhPasHidupMatiUmurSexLebih64thL: parseInt(e.target[18].value),
                jmlhPasHidupMatiUmurSexLebih64thP: parseInt(e.target[19].value),
                jmlhPasKeluarMati: parseInt(e.target[20].value),
              },
            ],
          },
          customConfig
        );
        console.log(result.data);
        toast("Data Berhasil Disimpan", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setTimeout(() => {
          navigate(0);
        }, 1000);
      } catch (error) {
        toast(`Data tidak bisa disimpan karena ,${error.response.data.message}`, {
          position: toast.POSITION.TOP_RIGHT
        })
        setButtonStatus(false)
      }
    }
    else {
      toast(`Data Gagal Disimpan, Data Jumlah Pasien Keluar Mati Lebih Dari Jumlah Pasien Hidup dan Mati`, {
        position: toast.POSITION.TOP_RIGHT
      })
      setButtonStatus(false)
    }
  };

  const maxLengthCheck = (object) => {
    if (object.target.value.length > object.target.maxLength) {
      object.target.value = object.target.value.slice(
        0,
        object.target.maxLength
      );
    }
  };

  return (
    <div className="container" style={{ marginTop: "70px" }}>
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
      <div className="row mt-3">
        <div className="col-md-6">
        <Link to={`/rl4a/`} className='btn btn-info' style={{fontSize:"18px", backgroundColor: "#779D9E", color: "#FFFFFF"}}>
          {/* <IoArrowBack size={30} style={{ color: "gray", cursor: "pointer" }} /> */}
          &lt;
        </Link>
          <span style={{ color: "gray" }}> 
          Kembali RL 4A Penyakit Rawat Inap</span>
          <div className="card">
            <div className="card-body">
              <h5 className="card-title h5">Search Nama Penyakit</h5>
              <form onSubmit={CariPenyakit}>
                <div
                  className="form-floating"
                  style={{ width: "100%", display: "inline-block" }}
                >
                  <input
                    name="caripenyakit"
                    type="text"
                    className="form-control"
                    id="floatingInput"
                    placeholder="Nama Penyakit / KODE ICD 10"
                    value={caripenyakit}
                    onChange={(e) => changeHandlerCariPenyakit(e)}
                  />
                  <label htmlFor="floatingInput">
                    Search Nama Penyakit / KODE ICD10
                  </label>
                </div>
                <div className="mt-3 mb-3">
                  <button type="submit" className="btn btn-outline-success">
                    <HiSaveAs /> Cari
                  </button>
                </div>
              </form>
              <div className="container" style={{ textAlign: "center" }}>
                {/* <h5>test</h5> */}
                {spinnerSearch && (
                  <Spinner animation="grow" variant="success"></Spinner>
                )}
                {spinnerSearch && (
                  <Spinner animation="grow" variant="success"></Spinner>
                )}
                {spinnerSearch && (
                  <Spinner animation="grow" variant="success"></Spinner>
                )}
                {spinnerSearch && (
                  <Spinner animation="grow" variant="success"></Spinner>
                )}
                {spinnerSearch && (
                  <Spinner animation="grow" variant="success"></Spinner>
                )}
                {spinnerSearch && (
                  <Spinner animation="grow" variant="success"></Spinner>
                )}
              </div>
              <Table className={style.rlTable}>
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Kode Penyakit</th>
                    <th>Nama Penyakit</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {dataPenyakit.map((value, index) => {
                    return (
                      <tr key={value.id}>
                        <td>{value.no}</td>
                        <td style={{ textAlign: "left" }}>
                          {value.no_daftar_terperinci}
                        </td>
                        <td style={{ textAlign: "left" }}>{value.nama}</td>
                        <td>
                          <button
                            className="btn btn-outline-success"
                            onClick={() => DetailPenyakit(value.id)}
                          >
                            Tambah
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
        {datainput.length > 0 && (
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <form onSubmit={Simpan}>
                  <div className="container">
                    <h5 className="card-title h5">Periode Laporan</h5>
                    <h5 className="card-title h5">
                      Tambah Data Penyakit {datainput[0].namaPenyakit}
                    </h5>
                    <div
                      className="form-floating"
                      style={{ width: "100%", display: "inline-block" }}
                    >
                      <input
                        name="tahun"
                        type="text"
                        className="form-control"
                        id="floatingInput"
                        placeholder="Tahun"
                        value={tahun}
                        onChange={(e) => changeHandlerSingle(e)}
                        disabled={true}
                      />
                      <label htmlFor="floatingInput">Tahun</label>
                      <input
                        type="number"
                        id="jenisgolsebabid"
                        value={datainput[0].id}
                        readOnly
                        hidden
                      />
                    </div>
                  </div>
                  <div className="container mt-3">
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
                    <Table className={style.rlTable}>
                      <thead>
                        <tr>
                          <th>No.</th>
                          <th>Golongan Berdasarkan Umur</th>
                          <th>Laki Laki</th>
                          <th>Perempuan</th>
                        </tr>
                      </thead>
                      <tbody>
                        {datainput.map((value) => {
                          return value.label.map((test, no) => {
                            return (
                              <tr key={no}>
                                <td>{no + 1}</td>
                                <td style={{ textAlign: "left" }}>
                                  <label>{test.label}</label>
                                </td>
                                <td>
                                  <input
                                    type="number"
                                    name={test.namaL}
                                    className="input is-primary is-small form-control"
                                    defaultValue={0}
                                    min={0}
                                    maxLength={7}
                                    onInput={(e) => maxLengthCheck(e)}
                                    onPaste={preventPasteNegative}
                                    onKeyPress={preventMinus}
                                    onChange={(e) => changeHandler(e, no)}
                                    onFocus={handleFocus}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="number"
                                    name={test.namaP}
                                    className="input is-primary is-small form-control"
                                    defaultValue={0}
                                    min={0}
                                    maxLength={7}
                                    onInput={(e) => maxLengthCheck(e)}
                                    onPaste={preventPasteNegative}
                                    onKeyPress={preventMinus}
                                    onChange={(e) => changeHandler(e, no)}
                                    onFocus={handleFocus}
                                  />
                                </td>
                              </tr>
                            );
                          });
                        })}
                        <tr>
                          <td colSpan={2}>Jumlah Pasien Keluar (Mati)</td>
                          <td colSpan={2}>
                            <input
                              name="jumlahKunjungan"
                              type="number"
                              className="form-control"
                              id="jumlahKunjungan"
                              placeholder="jumlahKunjungan"
                              defaultValue={0}
                              min={0}
                              maxLength={7}
                              onInput={(e) => maxLengthCheck(e)}
                              onPaste={preventPasteNegative}
                              onKeyPress={preventMinus}
                              onChange={(e) => changeHandler(e)}
                              onFocus={handleFocus}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
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
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormTambahRL4A;