import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import style from "./FormTambahRL36.module.css";
import { useNavigate, Link } from "react-router-dom";
import { HiSaveAs } from "react-icons/hi";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import Table from "react-bootstrap/Table";
import { RiDeleteBin5Fill, RiEdit2Fill } from "react-icons/ri";
import { AiFillFileAdd } from "react-icons/ai";
import Spinner from "react-bootstrap/Spinner";

const RL36 = () => {
  const [namaRS, setNamaRS] = useState("");
  const [alamatRS, setAlamatRS] = useState("");
  const [namaPropinsi, setNamaPropinsi] = useState("");
  const [namaKabKota, setNamaKabKota] = useState("");
  const [tahun, setTahun] = useState(new Date().getFullYear() - 1);
  const [dataRL, setDataRL] = useState([]);
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const navigate = useNavigate();
  const [spinner, setSpinner] = useState(false);

  useEffect(() => {
    refreshToken();
    CariLastYear(new Date().getFullYear() - 1);
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

  const changeHandlerSingle = (event) => {
    setTahun(event.target.value);
  };

  const changeHandler = (event, index) => {
    let newDataRL = [...dataRL];
    const name = event.target.name;
    if (name === "check") {
      if (event.target.checked === true) {
        newDataRL[index].disabledInput = false;
      } else if (event.target.checked === false) {
        newDataRL[index].disabledInput = true;
      }
      newDataRL[index].checked = event.target.checked;
    } else if (name === "Total") {
      newDataRL[index].Total = event.target.value;
    } else if (name === "Khusus") {
      newDataRL[index].Khusus = event.target.value;
    } else if (name === "Besar") {
      newDataRL[index].Besar = event.target.value;
    } else if (name === "Sedang") {
      newDataRL[index].Sedang = event.target.value;
    } else if (name === "Kecil") {
      newDataRL[index].Kecil = event.target.value;
    }
    setDataRL(newDataRL);
  };

  const CariLastYear = async (tahun) => {
    try {
      setSpinner(true);
      const customConfig = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        params: {
          tahun: tahun,
        },
      };
      const results = await axiosJWT.get(
        "/apisirs/rltigatitikenam",
        customConfig
      );

      // console.log(results)

      const rlTigaTitikEnamDetails = results.data.data.map((value) => {
        return value.rl_tiga_titik_enam_details;
      });

      let dataRLTigaTitikEnamDetails = [];
      rlTigaTitikEnamDetails.forEach((element) => {
        element.forEach((value) => {
          dataRLTigaTitikEnamDetails.push(value);
        });
      });

      setDataRL(dataRLTigaTitikEnamDetails);
      setSpinner(false);
      // console.log(dataRLTigaTitikEnamDetails);
      // console.log(dataRL);
    } catch (error) {
      console.log(error);
    }
  };

  const Cari = async (e) => {
    e.preventDefault();
    setSpinner(true);
    try {
      const customConfig = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        params: {
          tahun: tahun,
        },
      };
      const results = await axiosJWT.get(
        "/apisirs/rltigatitikenam",
        customConfig
      );

      // console.log(results)

      const rlTigaTitikEnamDetails = results.data.data.map((value) => {
        return value.rl_tiga_titik_enam_details;
      });

      let dataRLTigaTitikEnamDetails = [];
      rlTigaTitikEnamDetails.forEach((element) => {
        element.forEach((value) => {
          dataRLTigaTitikEnamDetails.push(value);
        });
      });

      setDataRL(dataRLTigaTitikEnamDetails);
      setSpinner(false);
      // console.log(dataRLTigaTitikEnamDetails);
      // console.log(dataRL);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteDetailRL = async (id) => {
    try {
      const customConfig = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axiosJWT.delete("/apisirs/rltigatitikenam/" + id, customConfig);
      toast("Data Berhasil Dihapus", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setDataRL((current) => current.filter((value) => value.id !== id));
    } catch (error) {
      console.log(error);
      toast("Data Gagal Dihapus", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const Delete = (id) => {
    confirmAlert({
      title: "Konfirmasi Penghapusan",
      message: "Apakah Anda Yakin ?",
      buttons: [
        {
          label: "Ya",
          onClick: () => {
            deleteDetailRL(id);
          },
        },
        {
          label: "Tidak",
        },
      ],
    });
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
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title h5">Periode Laporan</h5>
              <form onSubmit={Cari}>
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
                  />
                  <label htmlFor="floatingInput">Tahun</label>
                </div>
                <div className="mt-3 mb-3">
                  <button type="submit" className="btn btn-outline-success">
                    <HiSaveAs /> Cari
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-3 mb-3">
        <div className="col-md-12">
          {/* <Link
            to={`/rl36/tambah/`}
            style={{ textDecoration: "none", display: "flex" }}
          >
            <AiFillFileAdd
              size={30}
              style={{ color: "gray", cursor: "pointer" }}
            />
            <span style={{ color: "gray" }}>RL 3.6 Pembedahan</span>
          </Link> */}
          <Link to={`/rl36/tambah/`} className='btn btn-info' style={{fontSize:"18px", backgroundColor: "#779D9E", color: "#FFFFFF"}}>
          +
          </Link>
            <span style={{ color: "gray" }}>RL 3.6 Pembedahan</span>
          <div className="container" style={{ textAlign: "center" }}>
            {/* <h5>test</h5> */}
            {spinner && <Spinner animation="grow" variant="success"></Spinner>}
            {spinner && <Spinner animation="grow" variant="success"></Spinner>}
            {spinner && <Spinner animation="grow" variant="success"></Spinner>}
            {spinner && <Spinner animation="grow" variant="success"></Spinner>}
            {spinner && <Spinner animation="grow" variant="success"></Spinner>}
            {spinner && <Spinner animation="grow" variant="success"></Spinner>}
          </div>
          <Table
            className={style.rlTable}
            bordered
            responsive
            style={{ width: "100%" }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    width: "2%",
                    textAlign: "center",
                    verticalAlign: "middle",
                  }}
                >
                  No.
                </th>
                <th style={{ width: "15%", textAlign: "center" }}> </th>
                <th style={{ width: "20%", textAlign: "center" }}>
                  Jenis Spesialisasi
                </th>
                <th style={{ width: "10%", textAlign: "center" }}>Total</th>
                <th style={{ width: "10%", textAlign: "center" }}>Khusus</th>
                <th style={{ width: "10%", textAlign: "center" }}>Besar</th>
                <th style={{ width: "10%", textAlign: "center" }}>Sedang</th>
                <th style={{ width: "10%", textAlign: "center" }}>Kecil</th>
              </tr>
            </thead>
            <tbody>
              {dataRL.map((value, index) => {
                return (
                  <tr key={value.id}>
                    <td
                      style={{ textAlign: "center", verticalAlign: "middle" }}
                    >
                      <label htmlFor="">{index + 1}</label>
                    </td>
                    <td>
                      <ToastContainer />
                      {/* <RiDeleteBin5Fill
                        size={20}
                        onClick={(e) => Delete(value.id)}
                        style={{
                          color: "gray",
                          cursor: "pointer",
                          marginRight: "5px",
                        }}
                      /> */}
                      <div style={{display: "flex"}}>
                      <button className="btn btn-danger" style={{margin: "0 5px 0 0", backgroundColor: "#FF6663", border: "1px solid #FF6663"}} type='button' onClick={(e) => Delete(value.id)}>H</button>
                      {value.jenis_spesialisasi.nama !== "Tidak Ada Data" &&
                      <Link to={`/rl36/ubah/${value.id}`} className='btn btn-warning' style={{margin: "0 5px 0 0", backgroundColor: "#CFD35E", border: "1px solid #CFD35E", color:"#FFFFFF"}} >
                        U
                      </Link>
                      }
                      </div>
                      {/* {value.jenis_spesialisasi.nama !== "Tidak Ada Data" &&
                      <Link to={`/rl36/ubah/${value.id}`}>
                        <RiEdit2Fill
                          size={20}
                          style={{ color: "gray", cursor: "pointer" }}
                        />
                      </Link>
                      } */}
                      
                    </td>
                    <td>
                      <input
                        type="text"
                        name="jenisSpesialisasi"
                        className="form-control"
                        value={value.jenis_spesialisasi.nama}
                        disabled={true}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="Total"
                        className="form-control"
                        value={value.total}
                        onChange={(e) => changeHandler(e, index)}
                        disabled={true}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="Khusus"
                        className="form-control"
                        value={value.khusus}
                        onChange={(e) => changeHandler(e, index)}
                        disabled={true}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="Besar"
                        className="form-control"
                        value={value.besar}
                        onChange={(e) => changeHandler(e, index)}
                        disabled={true}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="Sedang"
                        className="form-control"
                        value={value.sedang}
                        onChange={(e) => changeHandler(e, index)}
                        disabled={true}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="Kecil"
                        className="form-control"
                        value={value.kecil}
                        onChange={(e) => changeHandler(e, index)}
                        disabled={true}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default RL36;
