import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useNavigate, useParams, Link} from "react-router-dom";
import style from "./FormTambahRL12.module.css";
import { HiSaveAs } from "react-icons/hi";
import { IoArrowBack } from 'react-icons/io5';
import { ToastContainer, toast } from "react-toastify";


const FormEditRL12 = () => {
  // const [tahun, setTahun] = useState('')f
  const [namaRS, setNamaRS] = useState("");
  const [alamatRS, setAlamatRS] = useState("");
  const [namaPropinsi, setNamaPropinsi] = useState("");
  const [namaKabKota, setNamaKabKota] = useState("");
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");
  const [dataRL, setData] = useState([]);
   const [tahun, setTahun] = useState('')
    const [bor, setBor] = useState('')
    const [los, setLos] = useState('')
    const [bto, setBto] = useState('')
    const [toi, setToi] = useState('')
    const [gdr, setGdr] = useState('')
    const [ndr, setNdr] = useState('')
    const [rata_kunjungan, setRataKunjungan] = useState('')
    const { id } = useParams();

  useEffect(() => {
    refreshToken();
    dataRlsatutitikdua();
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
     // console.log(response.data);
      setNamaRS(response.data.data[0].nama);
      setAlamatRS(response.data.data[0].alamat);
      setNamaPropinsi(response.data.data[0].propinsi.nama);
      setNamaKabKota(response.data.data[0].kabKota.nama);
    } catch (error) {}
  };
  const dataRlsatutitikdua = async () => {
    try {
      const response = await axiosJWT.get("/apisirs/rlsatutitikduadetail/" + id, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      setBor(response.data.data.bor);
      setLos(response.data.data.los);
      setToi(response.data.data.toi);
      setBto(response.data.data.bto);
      setNdr(response.data.data.ndr);
      setGdr(response.data.data.gdr);
      setRataKunjungan(response.data.data.rata_kunjungan);
    } catch (error) {}
  };

  const updateDataRLSatuTitikDua = async (e) => {
        e.preventDefault();
        try {
            const customConfig = {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    }
            const result = await axiosJWT.patch('/apisirs/rlsatutitikdua/' + id, {
                bor,
                los,
                bto,
                toi,
                ndr,
                gdr,
                rata_kunjungan,
            }, customConfig);
            toast('Data Berhasil Diupdate', {
                position: toast.POSITION.TOP_RIGHT
            })
            setTimeout(() => {
                navigate('/rl12')
            }, 1000);
        } catch (error) {
            console.log(error)
            toast('Data Gagal Diupdate', {
                position: toast.POSITION.TOP_RIGHT
            })
        }
    };

    const preventPasteNegative = (e) => {
      const clipboardData = e.clipboardData || window.clipboardData;
      const pastedData = parseFloat(clipboardData.getData('text'));
  
      if (pastedData < 0) {
          e.preventDefault();
      }
  }
  
  const preventMinus = (e) => {
      if (e.code === 'Minus') {
          e.preventDefault();
      }
  }

  const handleFocus = ((event) => {
    event.target.select()
})

const changeHandler = (event, index) => {
    // console.log(event)
    switch (event.target.name) {
        case "BOR":
            if(event.target.value === ""){
                event.target.value = 0
                event.target.select(event.target.value)
            }
            setBor(parseFloat(event.target.value))
            break;
            case "LOS":
                if(event.target.value === ""){
                    event.target.value = 0
                    event.target.select(event.target.value)
                }
                setLos(parseInt(event.target.value))
                break;
                case "BTO":
                    if(event.target.value === ""){
                        event.target.value = 0
                        event.target.select(event.target.value)
                    }
                    setBto(parseFloat(event.target.value))
                    break;
                    case "TOI":
                        if(event.target.value === ""){
                            event.target.value = 0
                            event.target.select(event.target.value)
                        }
                        setToi(parseFloat(event.target.value))
                        break;
                        case "NDR":
                            if(event.target.value === ""){
                                event.target.value = 0
                                event.target.select(event.target.value)
                            }
                            setNdr(parseFloat(event.target.value))
                            break;
                            case "GDR":
                                if(event.target.value === ""){
                                    event.target.value = 0
                                    event.target.select(event.target.value)
                                }
                                setGdr(parseFloat(event.target.value))
                                break;
                                case "rataKunjungan":
                                    if(event.target.value === ""){
                                        event.target.value = 0
                                        event.target.select(event.target.value)
                                    }
                                    setRataKunjungan(parseFloat(event.target.value))
                                    break;
        default:
            break;
    }
}

  return (
    <div className="container" style={{ marginTop: "70px" }}>
      <form onSubmit={updateDataRLSatuTitikDua}>
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
          <br></br>
          <Link to={`/rl12`} className='btn btn-info' style={{fontSize:"18px", backgroundColor: "#779D9E", color: "#FFFFFF"}}>
          &lt;
                            {/* <IoArrowBack size={30} style={{color:"gray",cursor: "pointer"}}/> */}
                        </Link>
                        <span style={{color: "gray"}}>RL1.2 Indikator Pelayanan Rumah Sakit</span>
            <table className={style.rlTable}>
              <thead>
                <tr>
                  <th>BOR</th>
                  <th>LOS</th>
                  <th>TOI</th>
                  <th>BTO</th>
                  <th>NDR</th>
                  <th>GDR</th>
                  <th>Rata - Rata Kunjungan</th>
                </tr>
              </thead>
              <tbody>
                    <tr>
                                            <td>
                                                <input type="number" step="0.001" name="BOR" className="form-control" value={bor} min={0} onPaste={preventPasteNegative}
                                                onKeyPress={preventMinus}  onFocus={handleFocus} onChange={(e) => changeHandler(e)}/>
                                            </td>
                                            <td>
                                                <input type="number" className="form-control" name="LOS" value={ los } min={0} max={999} onPaste={preventPasteNegative}
                                                onKeyPress={preventMinus}  onFocus={handleFocus} onChange={(e) => changeHandler(e)} />
                                            </td>
                                            <td>
                                                <input type="number" step="0.001" nama="TOI" className="form-control" name="TOI" value={ toi } min={0} max={999} onPaste={preventPasteNegative}
                                                onKeyPress={preventMinus}  onFocus={handleFocus} onChange={(e) => changeHandler(e)}/>
                                            </td>
                                            <td>
                                                <input type="number" step="0.001" name="BTO" className="form-control" value={ bto }  min={0} max={999} onPaste={preventPasteNegative}
                                                onKeyPress={preventMinus}  onFocus={handleFocus} onChange={(e) => changeHandler(e)}/>
                                            </td>
                                            <td>
                                                <input type="number" step="0.001" name="NDR" className="form-control" value={ ndr }  min={0} max={999} onPaste={preventPasteNegative}
                                                onKeyPress={preventMinus} onFocus={handleFocus} onChange={(e) => changeHandler(e)}/>
                                            </td>
                                            <td>
                                                <input type="number" step="0.001" name="GDR" className="form-control" value={ gdr }  min={0} max={999} onPaste={preventPasteNegative}
                                                onKeyPress={preventMinus} onFocus={handleFocus} onChange={(e) => changeHandler(e)}/>
                                            </td>
                                            <td>
                                                <input type="number" step="0.001" name="rataKunjungan" className="form-control" value={ rata_kunjungan } min={0} max={999} onPaste={preventPasteNegative}
                                                onKeyPress={preventMinus} onFocus={handleFocus} onChange={(e) => changeHandler(e)}/>
                                            </td>
                                        </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-3 mb-3">
          <ToastContainer />
          <button type="submit" className="btn btn-outline-success">
            <HiSaveAs /> Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormEditRL12;