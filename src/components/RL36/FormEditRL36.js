import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useNavigate, useParams, Link } from "react-router-dom";
import style from "./FormTambahRL36.module.css";
import { HiSaveAs } from "react-icons/hi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoArrowBack } from "react-icons/io5";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";

export const FormEditRL36 = () => {
  // const [tahun, setTahun] = useState("");
  const [namaRS, setNamaRS] = useState("");
  const [alamatRS, setAlamatRS] = useState("");
  const [namaPropinsi, setNamaPropinsi] = useState("");
  const [namaKabKota, setNamaKabKota] = useState("");
  const [setSpesialis, setNamaSpesialis] = useState("");
  // const [no, setNo] = useState("");
  const [khusus, setKhusus] = useState("");
  const [besar, setBesar] = useState("");
  const [sedang, setSedang] = useState("");
  const [kecil, setKecil] = useState("");
  // const [dataRL, setDataRL] = useState([]);
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const [spinner, setSpinner] = useState(false);
  const [buttonStatus, setButtonStatus] = useState(false)

  useEffect(() => {
    refreshToken();
    getRLTigaTitikEnamById();
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

  // const changeHandlerSingle = (event) => {
  //   setTahun(event.target.value);
  // };

  const changeHandler = (event, index) => {
    // console.log(event)
    switch (event.target.name) {
      case "Khusus":
        if (event.target.value === "") {
          event.target.value = 0;
          event.target.select(event.target.value);
        }
        setKhusus(parseInt(event.target.value))
        break;
      
      case "Besar":
        if (event.target.value === "") {
          event.target.value = 0;
          event.target.select(event.target.value);
        }
        setBesar(parseInt(event.target.value))
        break;
      case "Sedang":
        if (event.target.value === "") {
          event.target.value = 0;
          event.target.select(event.target.value);
        }
        setSedang(parseInt(event.target.value))
        break;

      case "Kecil":
        if (event.target.value === "") {
          event.target.value = 0;
          event.target.select(event.target.value);
        }
        setKecil(parseInt(event.target.value))
        break;
    
      default:
        console.log(event.target.name)
        break;
    }
  };

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

  const getRLTigaTitikEnamById = async () => {
    setSpinner(true)
    const response = await axiosJWT.get("/apisirs/rltigatitikenam/update/" + id, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setNamaSpesialis(response.data.data.jenis_spesialisasi.nama);
    setKhusus(response.data.data.khusus);
    setBesar(response.data.data.besar);
    setSedang(response.data.data.sedang);
    setKecil(response.data.data.kecil);
    setSpinner(false)
    // setNo(response.data.data.jenis_spesialis_id);
  };

  const UpdateRLTigaTitikEnam = async (e) => {
    e.preventDefault();
    setButtonStatus(true)
    try {
      const customConfig = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      await axiosJWT.patch(
        "/apisirs/rltigatitikenam/" + id,
        {
          khusus,
          besar,
          sedang,
          kecil,
        },
        customConfig
      );
      toast("Data Berhasil Diupdate", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setTimeout(() => {
        navigate("/rl36");
      }, 1000);
      //   console.log(parseInt(khusus));
    } catch (error) {
      setButtonStatus(false)
      toast("Data tidak bisa disimpan karena ", {
        position: toast.POSITION.TOP_RIGHT,
      });
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

  const maxLengthCheck = (object) => {
    if (object.target.value.length > object.target.maxLength) {
      object.target.value = object.target.value.slice(0, object.target.maxLength)
    }
  }

  return (
    <div className="container" style={{ marginTop: "70px" }}>
      <form onSubmit={UpdateRLTigaTitikEnam}>
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
          <div className="col-md-12">
              {/* <Link to={`/rl36`} style={{ textDecoration: "none" }}>
                <IoArrowBack
                  size={30}
                  style={{ color: "gray", cursor: "pointer" }}
                />
                <span style={{ color: "gray" }}>RL 3.6 Pembedahan</span>
              </Link> */}
              <Link to={`/rl36/`} className='btn btn-info' style={{fontSize:"18px", backgroundColor: "#779D9E", color: "#FFFFFF"}}>
              &lt;
            </Link>
            <span style={{ color: "gray" }}> Kembali RL 3.6 Pembedahan</span>
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
                  <th style={{ width: "20%" }}>Jenis Spesialisasi</th>
                  <th>Khusus</th>
                  <th>Besar</th>
                  <th>Sedang</th>
                  <th>Kecil</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <input
                      name="nama"
                      type="text"
                      className="form-control"
                      id="floatingInput"
                      placeholder="Kegiatan"
                      value={setSpesialis}
                      // onChange={(e) => changeHandler(e)}
                      disabled={true}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="Khusus"
                      className="form-control"
                      value={khusus}
                      min={0}
                      maxLength={7}
                      onInput={(e) => maxLengthCheck(e)}
                      // onChange={(e) => setKhusus(parseInt(e.target.value))}
                      onChange={(e) => changeHandler(e)}
                      onPaste={preventPasteNegative}
                      onKeyPress={preventMinus}
                      onFocus={handleFocus}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="Besar"
                      className="form-control"
                      value={besar}
                      min={0}
                      maxLength={7}
                      onInput={(e) => maxLengthCheck(e)}
                      // onChange={(e) => setBesar(parseInt(e.target.value))}
                      onChange={(e) => changeHandler(e)}
                      onPaste={preventPasteNegative}
                      onKeyPress={preventMinus}
                      onFocus={handleFocus}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="Sedang"
                      className="form-control"
                      value={sedang}
                      min={0}
                      maxLength={7}
                      onInput={(e) => maxLengthCheck(e)}
                      // onChange={(e) => setSedang(parseInt(e.target.value))}
                      onChange={(e) => changeHandler(e)}
                      onPaste={preventPasteNegative}
                      onKeyPress={preventMinus}
                      onFocus={handleFocus}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="Kecil"
                      className="form-control"
                      value={kecil}
                      min={0}
                      maxLength={7}
                      onInput={(e) => maxLengthCheck(e)}
                      // onChange={(e) => setKecil(parseInt(e.target.value))}
                      onChange={(e) => changeHandler(e)}
                      onPaste={preventPasteNegative}
                      onKeyPress={preventMinus}
                      onFocus={handleFocus}
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
          </div>
        </div>
      </form>
    </div>
  );
};
