import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useNavigate, Link } from "react-router-dom";
import { HiSaveAs } from "react-icons/hi";
import style from "./FormTambahRL4BSebab.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Table from "react-bootstrap/Table";
import { IoArrowBack } from "react-icons/io5";
import Spinner from "react-bootstrap/Spinner";

const FormTambahRL4BSebab = () => {
  const [tahun, setTahun] = useState(new Date().getFullYear() - 1);
  const [namaRS, setNamaRS] = useState("");
  const [alamatRS, setAlamatRS] = useState("");
  const [namaPropinsi, setNamaPropinsi] = useState("");
  const [namaKabKota, setNamaKabKota] = useState("");
  // const [dataRL, setDataRL] = useState([]);
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [caripenyakit, setCariPenyakit] = useState("");
  const [dataPenyakit, setDataPenyakit] = useState([]);
  const [datainput, setDataInput] = useState([]);
  // const [datasend, setDataSend] = useState([]);
  // const [genderdetailpenyakit, setGenderDetailPenyakit] = useState(0);
  // const [detailnamapenyakit, setDetailNamaPenyakit] = useState(" ");
  // const [tabledetail, setTableDetail] = useState("");

  const navigate = useNavigate();
  const [buttonStatus, setButtonStatus] = useState(false)
  const [spinnerSearch, setSpinnerSearch] = useState(false);
  const [spinner, setSpinner] = useState(false);

  useEffect(() => {
    refreshToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

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

  const CariPenyakit = async (e) => {
    e.preventDefault();
    setSpinnerSearch(true)
    try {
      const response = await axiosJWT.get(
        "/apisirs/rlempatbsebab/penyakit?search=" + caripenyakit,
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
      setSpinnerSearch(false)
    } catch (error) {
      console.log(error);
    }
  };

  const changeHandlerSingle = (event) => {
    setTahun(event.target.value);
  };

  const changeHandlerCariPenyakit = (event) => {
    setCariPenyakit(event.target.value);
  };

  const handleFocus = ((event) => {
    event.target.select()
  })

  const changeHandler = (event, index) => {
    if(event.target.value === ''){
      event.target.value = 0
      event.target.select(event.target.value)
    }
  }

  const DetailPenyakit = async (id) => {
    setSpinner(true)
    try {
      const response = await axiosJWT.get("/apisirs/rlempatbsebab/idpenyakit?id=" + id, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const DetailPenyakitTemplate = response.data.data.map((value) => {
        return {
          id: value.id,
          namaPenyakit: value.nama,
          gender: value.gender,
          jumlahkunjugan: 0,
          label: [
            {
              label: "0 - 6 Hari",
              JumlahPasienL: 0,
              namaL: "jmlhPasKasusUmurSex0hr6hrL",
              JumlahPasienP: 0,
              namaP: "jmlhPasKasusUmurSex0hr6hrP",
            },
            {
              label: "7 - 28 Hari",
              JumlahPasienL: 0,
              JumlahPasienP: 0,
              namaL: "jmlhPasKasusUmurSex6hr28hrL",
              namaP: "jmlhPasKasusUmurSex6hr28hrP",
            },
            {
              label: "29 Hari - < 1 tahun ",
              JumlahPasienL: 0,
              JumlahPasienP: 0,
              namaL: "jmlhPasKasusUmurSex28hr1thL",
              namaP: "jmlhPasKasusUmurSex28hr1thP",
            },
            {
              label: "1 - 4 tahun",
              JumlahPasienL: 0,
              JumlahPasienP: 0,
              namaL: "jmlhPasKasusUmurSex1th4thL",
              namaP: "jmlhPasKasusUmurSex1th4thP",
            },
            {
              label: "5 - 14 tahun",
              JumlahPasienL: 0,
              JumlahPasienP: 0,
              namaL: "jmlhPasKasusUmurSex4th14thL",
              namaP: "jmlhPasKasusUmurSex4th14thP",
            },
            {
              label: "15 - 24 tahun",
              JumlahPasienL: 0,
              JumlahPasienP: 0,
              namaL: "jmlhPasKasusUmurSex14th24thL",
              namaP: "jmlhPasKasusUmurSex14th24thP",
            },
            {
              label: "25 - 44 tahun",
              JumlahPasienL: 0,
              JumlahPasienP: 0,
              namaL: "jmlhPasKasusUmurSex24th44thL",
              namaP: "jmlhPasKasusUmurSex24th44thP",
            },
            {
              label: "45 - 64 tahun",
              JumlahPasienL: 0,
              JumlahPasienP: 0,
              namaL: "jmlhPasKasusUmurSex44th64L",
              namaP: "jmlhPasKasusUmurSex44th64P",
            },
            {
              label: ">= 65 tahun",
              JumlahPasienL: 0,
              JumlahPasienP: 0,
              namaL: "jmlhPasKasusUmurSexLebih64L",
              namaP: "jmlhPasKasusUmurSexLebih64P",
            },
            // {
            //   label: "Jumlah Kunjungan",
            //   JumlahPasienL: 0,
            //   JumlahPasienP: 0,
            //   namaL: "jmlhKunjungan",
            //   namaP: "jmlhKunjungan",
            // },
          ],
          //   detail: [
          //     {
          //       JumlahPasienUmur06hariL: 0,
          //       JumlahPasienUmur06hariP: 0,
          //     },
          //     {
          //       JumlahPasienUmur628hariL: 0,
          //       JumlahPasienUmur628hariP: 0,
          //     },
          //     {
          //       JumlahPasienUmur28hari1thL: 0,
          //       JumlahPasienUmur28hari1thP: 0,
          //     },
          //     {
          //       JumlahPasienUmur1th4thL: 0,
          //       JumlahPasienUmur1th4thP: 0,
          //     },
          //     {
          //       JumlahPasienUmur4th14thL: 0,
          //       JumlahPasienUmur4th14thP: 0,
          //     },
          //     {
          //       JumlahPasienUmur14th24thL: 0,
          //       JumlahPasienUmur14th24thP: 0,
          //     },
          //     {
          //       JumlahPasienUmur24th44thL: 0,
          //       JumlahPasienUmur24th44thP: 0,
          //     },
          //     {
          //       JumlahPasienUmur44th64thL: 0,
          //       JumlahPasienUmur44th64thP: 0,
          //     },
          //     {
          //       JumlahPasienUmurLebih64thL: 0,
          //       JumlahPasienUmurLebih64thP: 0,
          //     },
          //     {
          //       JumlahKunjungan: 0,
          //     },
          //   ],
          //   disabledInput: true,
          //   checked: false,
        };
      });
      setDataInput(DetailPenyakitTemplate);
      setSpinner(false)
    } catch (error) {
      console.log(error);
    }
  };

  const SIMPAN = async (e) => {
    e.preventDefault();
    setButtonStatus(true)
    let counttotal = parseInt(e.target[2].value) +
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
    if (parseInt(e.target[20].value) >= counttotal) {
      try {
        //   setDataSend({
        //     tahun: e.target[0].value,
        //     data: {
        //       jenisGolSebabId: parseInt(e.target[1].value),
        //       jmlhPasKasusUmurSex0hr6hrL: parseInt(e.target[2].value),
        //       jmlhPasKasusUmurSex0hr6hrP: parseInt(e.target[3].value),
        //       jmlhPasKasusUmurSex6hr28hrL: parseInt(e.target[4].value),
        //       jmlhPasKasusUmurSex6hr28hrP: parseInt(e.target[5].value),
        //       jmlhPasKasusUmurSex28hr1thL: parseInt(e.target[6].value),
        //       jmlhPasKasusUmurSex28hr1thP: parseInt(e.target[7].value),
        //       jmlhPasKasusUmurSex1th4thL: parseInt(e.target[8].value),
        //       jmlhPasKasusUmurSex1th4thP: parseInt(e.target[9].value),
        //       jmlhPasKasusUmurSex4th14thL: parseInt(e.target[10].value),
        //       jmlhPasKasusUmurSex4th14thP: parseInt(e.target[11].value),
        //       jmlhPasKasusUmurSex14th24thL: parseInt(e.target[12].value),
        //       jmlhPasKasusUmurSex14th24thP: parseInt(e.target[13].value),
        //       jmlhPasKasusUmurSex24th44thL: parseInt(e.target[14].value),
        //       jmlhPasKasusUmurSex24th44thP: parseInt(e.target[15].value),
        //       jmlhPasKasusUmurSex44th64L: parseInt(e.target[16].value),
        //       jmlhPasKasusUmurSex44th64P: parseInt(e.target[17].value),
        //       jmlhPasKasusUmurSexLebih64L: parseInt(e.target[18].value),
        //       jmlhPasKasusUmurSexLebih64P: parseInt(e.target[19].value),
        //       jmlhKunjungan: parseInt(e.target[20].value),
        //     },
        //   });
        //   console.log(datasend);
        const customConfig = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        await axiosJWT.post(
          "/apisirs/rlempatbsebab",
          {
            tahun: parseInt(e.target[0].value),
            data: [
              {
                jenisGolSebabId: parseInt(e.target[1].value),
                jmlhPasKasusUmurSex0hr6hrL: parseInt(e.target[2].value),
                jmlhPasKasusUmurSex0hr6hrP: parseInt(e.target[3].value),
                jmlhPasKasusUmurSex6hr28hrL: parseInt(e.target[4].value),
                jmlhPasKasusUmurSex6hr28hrP: parseInt(e.target[5].value),
                jmlhPasKasusUmurSex28hr1thL: parseInt(e.target[6].value),
                jmlhPasKasusUmurSex28hr1thP: parseInt(e.target[7].value),
                jmlhPasKasusUmurSex1th4thL: parseInt(e.target[8].value),
                jmlhPasKasusUmurSex1th4thP: parseInt(e.target[9].value),
                jmlhPasKasusUmurSex4th14thL: parseInt(e.target[10].value),
                jmlhPasKasusUmurSex4th14thP: parseInt(e.target[11].value),
                jmlhPasKasusUmurSex14th24thL: parseInt(e.target[12].value),
                jmlhPasKasusUmurSex14th24thP: parseInt(e.target[13].value),
                jmlhPasKasusUmurSex24th44thL: parseInt(e.target[14].value),
                jmlhPasKasusUmurSex24th44thP: parseInt(e.target[15].value),
                jmlhPasKasusUmurSex44th64L: parseInt(e.target[16].value),
                jmlhPasKasusUmurSex44th64P: parseInt(e.target[17].value),
                jmlhPasKasusUmurSexLebih64L: parseInt(e.target[18].value),
                jmlhPasKasusUmurSexLebih64P: parseInt(e.target[19].value),
                jmlhKunjungan: parseInt(e.target[20].value),
              },
            ],
          },
          customConfig
        );
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

  const maxLengthCheck = (object) => {
    if (object.target.value.length > object.target.maxLength) {
      object.target.value = object.target.value.slice(0, object.target.maxLength)
    }
  }

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
        {/* <h5 style={{ textAlign: "center" }}>INPUT DATA RL 4B SEBAB LUAR</h5> */}
        {/* <Link to={`/rl4bsebab`}>
          <button className="btn btn-outline-warning">BACK</button>
        </Link> */}
        <Link to={`/rl4bsebab`} style={{ textDecoration: "none" }}>
          <IoArrowBack size={30} style={{ color: "gray", cursor: "pointer" }} />
          <span style={{ color: "gray" }}>INPUT DATA RL 4B SEBAB LUAR</span>
        </Link>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title h5">
                Search Nama Penyakit / KODE ICD10
              </h5>
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
                {spinnerSearch && <Spinner animation="grow" variant="success"></Spinner>}
                {spinnerSearch && <Spinner animation="grow" variant="success"></Spinner>}
                {spinnerSearch && <Spinner animation="grow" variant="success"></Spinner>}
                {spinnerSearch && <Spinner animation="grow" variant="success"></Spinner>}
                {spinnerSearch && <Spinner animation="grow" variant="success"></Spinner>}
                {spinnerSearch && <Spinner animation="grow" variant="success"></Spinner>}
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
                        <td>{index + 1}</td>
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
                  <form onSubmit={SIMPAN}>
                    <h5 className="card-title h5">
                      Input Nama Penyakit {datainput[0].namaPenyakit}
                    </h5>
                    <div className="container">
                      <h5 className="card-title h5">Periode Laporan</h5>
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
                          disabled
                          onChange={(e) => changeHandlerSingle(e)}
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
                        {spinner && <Spinner animation="grow" variant="success"></Spinner>}
                        {spinner && <Spinner animation="grow" variant="success"></Spinner>}
                        {spinner && <Spinner animation="grow" variant="success"></Spinner>}
                        {spinner && <Spinner animation="grow" variant="success"></Spinner>}
                        {spinner && <Spinner animation="grow" variant="success"></Spinner>}
                        {spinner && <Spinner animation="grow" variant="success"></Spinner>}
                      </div>
                      <Table className={style.rlTable}>
                        <thead>
                          <tr>
                            <th>No.</th>
                            <th>Golongan Umur</th>
                            <th>Laki-Laki</th>
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
                                      // value={test.JumlahPasienL}
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
                                      // value={test.JumlahPasienP}
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
                        </tbody>
                      </Table>
                      <div className="container">
                        <h5 className="card-title h5">Jumlah Kunjungan</h5>
                        <div
                          className="form-floating"
                          style={{ width: "100%", display: "inline-block" }}
                        >
                          <input
                            name="jumlahKunjungan"
                            type="number"
                            className="form-control"
                            id="jumlahKunjungan"
                            placeholder="jumlahKunjungan"
                            defaultValue={0}
                            min={0}
                            onPaste={preventPasteNegative}
                            onKeyPress={preventMinus}
                            onFocus={handleFocus}
                            onChange={(e) => changeHandler(e)}
                          />
                          <label htmlFor="jumlahKunjungan">Jumlah</label>
                        </div>
                      </div>
                     
                    </div>
                    <div className="mt-3 mb-3">
                      <ToastContainer />
                      <button type="submit" disabled={buttonStatus} className="btn btn-outline-success">
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

export default FormTambahRL4BSebab;
