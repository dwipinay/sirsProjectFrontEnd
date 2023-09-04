import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useNavigate, useParams, Link } from "react-router-dom";
import style from "./FormTambahRL39.module.css";
import { HiSaveAs } from "react-icons/hi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Table from "react-bootstrap/Table";
import { IoArrowBack } from "react-icons/io5";
import Spinner from "react-bootstrap/Spinner";

export const FormEditRL39 = () => {
  const [namaRS, setNamaRS] = useState("");
  const [alamatRS, setAlamatRS] = useState("");
  const [namaPropinsi, setNamaPropinsi] = useState("");
  const [namaKabKota, setNamaKabKota] = useState("");
  const [No, setNo] = useState("");
  const [jenistindakan, setJenisTindakan] = useState("");
  const [jumlah, setJumlah] = useState("");
  // const [dataRL, setDataRL] = useState([]);
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const [buttonStatus, setButtonStatus] = useState(false)
  const [spinner, setSpinner] = useState(false);

  useEffect(() => {
    refreshToken();
    getRLTigaTitikSembilanById();
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

  const changeHandler = (event, index) => {
    if (event.target.value === "") {
      event.target.value = 0;
      event.target.select(event.target.value);
    }
    setJumlah(parseInt(event.target.value))
  };

  const getRLTigaTitikSembilanById = async () => {
    setSpinner(true)
    const response = await axiosJWT.get("/apisirs/rltigatitiksembilan/update/" + id, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log(response);
    setJenisTindakan(response.data.data.group_jenis_tindakan.nama);
    setNo(response.data.data.group_jenis_tindakan.no);
    setJumlah(response.data.data.jumlah);
    setSpinner(false)
  };

  const UpdateRLTigaTitikSembilan = async (e) => {
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
        "/apisirs/rltigatitiksembilan/" + id,
        {
          jumlah,
        },
        customConfig
      );
      toast("Data Berhasil Diupdate", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setTimeout(() => {
        navigate("/rl39");
      }, 1000);
      //   console.log(parseInt(khusus));
    } catch (error) {
      setButtonStatus(false)
      toast("Data Gagal Disimpan", {
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
      <form onSubmit={UpdateRLTigaTitikSembilan}>
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
            {/* <Link to={`/rl39`} style={{ textDecoration: "none" }}>
              <IoArrowBack
                size={30}
                style={{ color: "gray", cursor: "pointer" }}
              />
              <span style={{ color: "gray" }}>RL 3.9 Rehab Medik Catatan</span>
            </Link> */}
            <Link to={`/rl39/`} className='btn btn-info' style={{fontSize:"18px", backgroundColor: "#779D9E", color: "#FFFFFF"}}>
              &lt;
            </Link>
            <span style={{ color: "gray" }}> Kembali RL 3.9 Rehab Medik Catatan</span>
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
                  <th style={{ width: "10%" }}>No Tindakan</th>
                  <th style={{ width: "50%" }}>Jenis Tindakan</th>
                  <th style={{ width: "40%" }}>Jumlah</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <label>{No}</label>
                  </td>
                  <td style={{textAlign: "left"}}>
                    <label>{jenistindakan}</label>
                  </td>
                  <td>
                    <input
                      type="number"
                      name="Jumlah"
                      className="form-control"
                      value={jumlah}
                      min={0}
                      maxLength={7}
                      onInput={(e) => maxLengthCheck(e)}
                      // onChange={(e) => setJumlah(e.target.value)}
                      onChange={(e) => changeHandler(e)}
                      onPaste={preventPasteNegative}
                      onKeyPress={preventMinus}
                      onFocus={handleFocus}
                    />
                  </td>
                </tr>
              </tbody>
            </Table>
            <div className="mt-3">
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
