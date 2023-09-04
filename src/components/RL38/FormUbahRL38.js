import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { Link, useNavigate, useParams } from "react-router-dom";
import style from "./FormTambahRL38.module.css";
import { HiSaveAs } from "react-icons/hi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { IoArrowBack } from "react-icons/io5";
import Table from "react-bootstrap/esm/Table";

export const FormEditRL38 = () => {
  const [tahun, setTahun] = useState("");
  const [namaRS, setNamaRS] = useState("");
  const [alamatRS, setAlamatRS] = useState("");
  const [namaPropinsi, setNamaPropinsi] = useState("");
  const [namaKabKota, setNamaKabKota] = useState("");
  const [jenisKegiatan, setJeniskegiatan] = useState("");
  const [jumlah, setJumlah] = useState(0);
  const [no, setNo] = useState("");
  const [nama, setNama] = useState("");
  const [dataRL, setDataRL] = useState([]);
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const [buttonStatus, setButtonStatus] = useState(false)

  useEffect(() => {
    refreshToken();
    getRLTigaTitikDelapanById();

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

  const handleFocus = (event) => event.target.select();

  const changeHandler = (event, index) => {
    const targetName = event.target.name;
    switch (targetName) {
      case "jumlah":
        console.log("c")
        if (event.target.value === "") {
          event.target.value = 0;
          event.target.select(event.target.value);
        }
        setJumlah(event.target.value);
        break;
      default:
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

  const getRLTigaTitikDelapanById = async () => {
    const response = await axiosJWT.get("/apisirs/rltigatitikdelapan/" + id, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // setNama(response.data.data.jenis_kegiatan.nama);
    setNo(response.data.data.jenis_kegiatan_id);
    setJeniskegiatan(response.data.data.jenis_kegiatan.nama);
    setJumlah(response.data.data.jumlah);
  };

  const UpdateRLTigaTitikDelapan = async (e) => {
    e.preventDefault();
    setButtonStatus(true)
    try {
      const customConfig = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const result = await axiosJWT.patch(
        "/apisirs/rltigatitikdelapan/" + id,
        {
          no,
          nama,
          jumlah,
        },
        customConfig
      );
      toast("Data Berhasil Diupdate", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setTimeout(() => {
        navigate("/rl38");
      }, 1000);
      //   console.log(parseInt(khusus));
    } catch (error) {
      toast("Data Gagal Diupdate", {
        position: toast.POSITION.TOP_RIGHT,
      });
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

  
  return (
    <div className="container" style={{ marginTop: "70px" }}>
      <form onSubmit={UpdateRLTigaTitikDelapan}>
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
        <div className="row">
          <div className="col-md-12">
            <Link to={`/rl38/`} className='btn btn-info' style={{fontSize:"18px", backgroundColor: "#779D9E", color: "#FFFFFF"}}>
              {/* <IoArrowBack
                size={30}
                style={{ color: "gray", cursor: "pointer" }}
              /> */}
              &lt;
            </Link>
              <span style={{ color: "gray" }}> Kembali RL 3.8 Laboratorium</span>
            <Table className={style.rlTable}>
              <thead>
                <tr>
                  {/* <th style={{ width: "6%" }}>No.</th> */}
                  {/* <th>No Kegiatan</th> */}
                  <th>Jenis Kegiatan</th>
                  <th>Jumlah</th>
                </tr>
              </thead>
              <tbody>
                <tr key={id}>
                  {/* <td>
                    <input
                      type="text"
                      name="no"
                      className="form-control"
                      value={setJeniskegiatan}
                      disabled={true}
                    />
                  </td> */}
                  <td>{jenisKegiatan}
                  </td>
                  <td>
                    {jenisKegiatan === "Tidak Ada Data" &&
                        <div className="control">
                        <input
                          type="number"
                          name="jumlah"
                          className="form-control"
                          value={jumlah}
                          onChange={(event) => changeHandler(event)}
                          onFocus={handleFocus}
                          placeholder="Jumlah"
                          min={0}
                          onPaste={preventPasteNegative}
                          onKeyPress={preventMinus}
                          disabled={true}
                        />
                      </div>
                      
                    }
                    { jenisKegiatan !== "Tidak Ada Data" &&
                      
                      <div className="control">
                      <input
                        type="number"
                        name="jumlah"
                        className="form-control"
                        value={jumlah}
                        onChange={(event) => changeHandler(event)}
                        onFocus={handleFocus}
                        placeholder="Jumlah"
                        min={0}
                        onPaste={preventPasteNegative}
                        onKeyPress={preventMinus}
                      />
                    </div>
                    } 
                    {/* <div className="control">
                      <input
                        type="number"
                        name="jumlah"
                        className="form-control"
                        value={jumlah}
                        onChange={(event) => changeHandler(event)}
                        onFocus={handleFocus}
                        placeholder="Jumlah"
                        min={0}
                        onPaste={preventPasteNegative}
                        onKeyPress={preventMinus}
                      />
                    </div> */}
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
        </div>
        <div className="mt-3 mb-3">
          <ToastContainer />
          <button type="submit" className="btn btn-outline-success" disabled={buttonStatus}>
            <HiSaveAs /> Simpan
          </button>
        </div>
      </form>
    </div>
  );
};
