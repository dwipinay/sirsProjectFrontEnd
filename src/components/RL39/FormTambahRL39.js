import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useNavigate, Link } from "react-router-dom";
import { HiSaveAs } from "react-icons/hi";
import style from "./FormTambahRL39.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoArrowBack } from "react-icons/io5";
import Spinner from "react-bootstrap/Spinner";

const FormTambahRL39 = () => {
  const [tahun, setTahun] = useState(new Date().getFullYear() - 1);
  // const [tahun, setTahun] = useState("");
  const [dataRL, setDataRL] = useState([]);
  const [namaRS, setNamaRS] = useState("");
  const [alamatRS, setAlamatRS] = useState("");
  const [namaPropinsi, setNamaPropinsi] = useState("");
  const [namaKabKota, setNamaKabKota] = useState("");
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const navigate = useNavigate();
  // const [groupname, setGroupname] = useState("")
  const [buttonStatus, setButtonStatus] = useState(false)
  const [spinner, setSpinner] = useState(false);

  useEffect(() => {
    refreshToken();
    getRLTigaTitikSembilanTemplate();
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

  const getRLTigaTitikSembilanTemplate = async () => {
    setSpinner(true);
    try {
      const response = await axiosJWT.get("/apisirs/jenisgrouptindakan?rlid=9", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const rlTemplate = response.data.data.map((value, index) => {
        return {
          id: value.id,
          No: value.no,
          jenisTindakan: value.nama,
          groupnama: value.group_jenis_tindakan_header.nama,
          Jumlah: 0,
          disabledInput: true,
          checked: false,
        };
      });
      setDataRL(rlTemplate);
      setSpinner(false)
      // console.log(response)
    } catch (error) {
      console.log("error", error);
    }
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
    } else if (name === "Jumlah") {
        if (event.target.value === '') {
          event.target.value = 0
          event.target.select(event.target.value)
        }
      newDataRL[index].Jumlah = event.target.value;
    }
    setDataRL(newDataRL);
  };

  const handleFocus = ((event) => {
    event.target.select()
  })

  const Simpan = async (e) => {
    e.preventDefault();
    setButtonStatus(true)
    try {
      const dataRLArray = dataRL
        .filter((value) => {
          return value.checked === true;
        })
        .map((value, index) => {
          return {
            jenisTindakanId: parseInt(value.id),
            jumlah: parseInt(value.Jumlah),
          };
        });

      const customConfig = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      await axiosJWT.post(
        "/apisirs/rltigatitiksembilan",
        {
          tahun: parseInt(tahun),
          data: dataRLArray,
        },
        customConfig
      );

      toast("Data Berhasil Disimpan", {
        position: toast.POSITION.TOP_RIGHT,
      });

      setTimeout(() => {
        navigate("/rl39");
      }, 1000);
      
    } catch (error) {
      toast(`Data tidak bisa disimpan karena ,${error.response.data.message}`, {
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
      <form onSubmit={Simpan}>
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
                    disabled
                  />
                  <label htmlFor="floatingInput">Tahun</label>
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
              <span style={{ color: "gray" }}>Input Data RL 3.9 Rehab Medik Catatan</span>
            </Link> */}
            <Link to={`/rl39/`} className='btn btn-info' style={{fontSize:"18px", backgroundColor: "#779D9E", color: "#FFFFFF"}}>
          &lt;
        </Link>
        <span style={{ color: "gray" }}>Kembali RL 3.9 Rehab Medik Catatan</span>
            <div className="container" style={{ textAlign: "center" }}>
              {/* <h5>test</h5> */}
              {spinner && <Spinner animation="grow" variant="success"></Spinner>}
              {spinner && <Spinner animation="grow" variant="success"></Spinner>}
              {spinner && <Spinner animation="grow" variant="success"></Spinner>}
              {spinner && <Spinner animation="grow" variant="success"></Spinner>}
              {spinner && <Spinner animation="grow" variant="success"></Spinner>}
              {spinner && <Spinner animation="grow" variant="success"></Spinner>}
            </div>
            <table className={style.rlTable}>
              <thead>
                <tr>
                  <th style={{ width: "3%" }}>No.</th>
                  <th style={{ width: "2%" }}></th>
                  <th style={{ width: "5%" }}>Group Name</th>
                  <th style={{ width: "5%" }}>No Tindakan</th>
                  <th style={{ width: "20%" }}>Jenis Tindakan</th>
                  <th style={{ width: "20%" }}>Jumlah</th>
                </tr>
              </thead>
              <tbody>
                {dataRL.map((value, index) => {
                  if(value.id === 41){
                    return (
                      <tr key={value.id}>
                        <td>{index + 1}</td>
                        <td>
                          <input
                            type="checkbox"
                            name="check"
                            className="checkbox"
                            onChange={(e) => changeHandler(e, index)}
                            checked={value.checked}
                          />
                        </td>
                        <td style={{ textAlign: "left" }}>{value.groupnama}</td>
                        <td style={{ textAlign: "left" }}>{value.No}</td>
                        <td style={{ textAlign: "left" }}>
                          <label>{value.jenisTindakan}</label>
                        </td>
                        <td>
                          <input
                            type="number"
                            name="Jumlah"
                            className="input is-primary is-small form-control"
                            min={0}
                            maxLength={7}
                            onInput={(e) => maxLengthCheck(e)}
                            value={value.Jumlah}
                            onChange={(e) => changeHandler(e, index)}
                            disabled={true}
                            onPaste={preventPasteNegative}
                            onKeyPress={preventMinus}
                            onFocus={handleFocus}
                          />
                        </td>
                      </tr>
                    );
                  } else {
                    return (
                      <tr key={value.id}>
                        <td>{index + 1}</td>
                        <td>
                          <input
                            type="checkbox"
                            name="check"
                            className="checkbox"
                            onChange={(e) => changeHandler(e, index)}
                            checked={value.checked}
                          />
                        </td>
                        <td style={{ textAlign: "left" }}>{value.groupnama}</td>
                        <td style={{ textAlign: "left" }}>{value.No}</td>
                        <td style={{ textAlign: "left" }}>
                          <label>{value.jenisTindakan}</label>
                        </td>
                        <td>
                          <input
                            type="number"
                            name="Jumlah"
                            className="input is-primary is-small form-control"
                            min={0}
                            maxLength={7}
                            onInput={(e) => maxLengthCheck(e)}
                            value={value.Jumlah}
                            onChange={(e) => changeHandler(e, index)}
                            disabled={value.disabledInput}
                            onPaste={preventPasteNegative}
                            onKeyPress={preventMinus}
                            onFocus={handleFocus}
                          />
                        </td>
                      </tr>
                    );
                  }
                  
                })}
              </tbody>
            </table>
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
  );
};

export default FormTambahRL39;
