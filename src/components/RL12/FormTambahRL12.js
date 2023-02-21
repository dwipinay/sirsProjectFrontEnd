import React, { useState, useEffect } from 'react'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { Link, useNavigate } from 'react-router-dom'
import style from './FormTambahRL12.module.css'
import { HiSaveAs } from 'react-icons/hi'
import { ToastContainer, toast } from 'react-toastify';
import { IoArrowBack } from 'react-icons/io5'
import 'react-toastify/dist/ReactToastify.css';

const FormTambahRL12 = () => {
    // const [tahun, setTahun] = useState('')
    const [namaRS, setNamaRS] = useState('')
    const [alamatRS, setAlamatRS] = useState('')
    const [namaPropinsi, setNamaPropinsi] = useState('')
    const [namaKabKota, setNamaKabKota] = useState('')
    // const [dataRL, setDataRL] = useState([])
    const [token, setToken] = useState('')
    const [expire, setExpire] = useState('')
    const navigate = useNavigate()
    const [msg, setMsg] = useState('')
    const [tahun, setTahun] = useState('')
    const [bor, setBor] = useState(0)
    const [los, setLos] = useState(0)
    const [bto, setBto] = useState(0)
    const [toi, setToi] = useState(0)
    const [gdr, setGdr] = useState(0)
    const [ndr, setNdr] = useState(0)
    const [rataKunjungan, setRataKunjungan] = useState(0)
    const [dataRL, setData] = useState([])




    useEffect(() => {
        refreshToken()
        // eslint-disable-next-line react-hooks/exhaustive-deps
        const date = new Date();
        setTahun(date.getFullYear() - 1)
    }, [])

    const refreshToken = async () => {
        try {
            const response = await axios.get('/apisirs/token')
            setToken(response.data.accessToken)
            const decoded = jwt_decode(response.data.accessToken)
            setExpire(decoded.exp)
            getDataRS(decoded.rsId)
        } catch (error) {
            if (error.response) {
                navigate('/')
            }
        }
    }

    const axiosJWT = axios.create()
    axiosJWT.interceptors.request.use(async (config) => {
        const currentDate = new Date()
        if (expire * 1000 < currentDate.getTime()) {
            const response = await axios.get('/apisirs/token')
            config.headers.Authorization = `Bearer ${response.data.accessToken}`
            setToken(response.data.accessToken)
            const decoded = jwt_decode(response.data.accessToken)
            setExpire(decoded.exp)
        }
        return config
    }, (error) => {
        return Promise.reject(error)
    })

    const getDataRS = async (id) => {
        try {
            const response = await axiosJWT.get('/apisirs/rumahsakit/' + id, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
           // console.log(response.data)
            setNamaRS(response.data.data[0].nama)
            setAlamatRS(response.data.data[0].alamat)
            setNamaPropinsi(response.data.data[0].propinsi.nama)
            setNamaKabKota(response.data.data[0].kabKota.nama)
        } catch (error) {

        }
    }

    const Simpan = async (e) => {
        e.preventDefault()
        const customConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
        try {
            await axiosJWT.post('/apisirs/rlsatutitikdua',
                {
                    tahun: tahun,
                    bor: bor,
                    los: los,
                    bto: bto,
                    toi: toi,
                    gdr: ndr,
                    ndr: ndr,
                    rataKunjungan: rataKunjungan
                },
                customConfig)

            toast('Data Berhasil Disimpan', {
                position: toast.POSITION.TOP_RIGHT
            })
            setTimeout(() => {
                navigate('/rl12')
            }, 1000);
        } catch (error) {
            toast(`Data tidak bisa disimpan karena ,${error.response.data.message}`, {
                position: toast.POSITION.TOP_RIGHT
            })
        }
    }

    const changeHandlerSingle = (event) => {
        setTahun(event.target.value)
    }

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
                if (event.target.value === "") {
                    event.target.value = 0
                    event.target.select(event.target.value)
                }
                setBor(parseFloat(event.target.value))
                break;
            case "LOS":
                if (event.target.value === "") {
                    event.target.value = 0
                    event.target.select(event.target.value)
                }

                setLos(parseInt(event.target.value))
                break;
            case "BTO":
                if (event.target.value === "") {
                    event.target.value = 0
                    event.target.select(event.target.value)
                }
                setBto(parseFloat(event.target.value))
                break;
            case "TOI":
                if (event.target.value === "") {
                    event.target.value = 0
                    event.target.select(event.target.value)
                }
                setToi(parseFloat(event.target.value))
                break;
            case "NDR":
                if (event.target.value === "") {
                    event.target.value = 0
                    event.target.select(event.target.value)
                }
                setNdr(parseFloat(event.target.value))
                break;
            case "GDR":
                if (event.target.value === "") {
                    event.target.value = 0
                    event.target.select(event.target.value)
                }
                setGdr(parseFloat(event.target.value))
                break;
            case "rataKunjungan":
                if (event.target.value === "") {
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
            <form onSubmit={Simpan}>
                <div className="row">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title h5">Profile Fasyankes</h5>
                                <div className="form-floating" style={{ width: "100%", display: "inline-block" }}>
                                    <input type="text" className="form-control" id="floatingInput"
                                        value={namaRS} disabled={true} />
                                    <label htmlFor="floatingInput">Nama</label>
                                </div>
                                <div className="form-floating" style={{ width: "100%", display: "inline-block" }}>
                                    <input type="text" className="form-control" id="floatingInput"
                                        value={alamatRS} disabled={true} />
                                    <label htmlFor="floatingInput">Alamat</label>
                                </div>
                                <div className="form-floating" style={{ width: "50%", display: "inline-block" }}>
                                    <input type="text" className="form-control" id="floatingInput"
                                        value={namaPropinsi} disabled={true} />
                                    <label htmlFor="floatingInput">Provinsi </label>
                                </div>
                                <div className="form-floating" style={{ width: "50%", display: "inline-block" }}>
                                    <input type="text" className="form-control" id="floatingInput"
                                        value={namaKabKota} disabled={true} />
                                    <label htmlFor="floatingInput">Kab/Kota</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title h5">Periode Laporan</h5>
                                <div className="form-floating" style={{ width: "100%", display: "inline-block" }}>
                                    <input name="tahun" type="text" className="form-control" id="floatingInput"
                                        placeholder="Tahun" value={tahun} onChange={e => changeHandlerSingle(e)} disabled />
                                    <label htmlFor="floatingInput">Tahun</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-md-12">
                        <br>
                        </br>
                        <Link to={`/rl12`} style={{ textDecoration: "none" }}>
                            <IoArrowBack size={30} style={{ color: "gray", cursor: "pointer" }} /><span style={{ color: "gray" }}>RL1.2 Indikator Pelayanan Rumah Sakit</span>
                        </Link>
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
                                        <input
                                            type="number"
                                            step="0.001"
                                            className="form-control"
                                            value={bor}
                                            name="BOR"
                                            // onChange={e => setBor(e.target.value) }  
                                            min={0}
                                            max={999}
                                            onPaste={preventPasteNegative}
                                            onKeyPress={preventMinus}
                                            onFocus={handleFocus}
                                            onChange={(e) => changeHandler(e)}
                                            maxLength="1" />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            name='LOS'
                                            className="form-control"
                                            value={los}
                                            // onChange={e => setLos(e.target.value)}
                                            min={0} onPaste={preventPasteNegative}
                                            max={999}
                                            onKeyPress={preventMinus}
                                            onFocus={handleFocus}
                                            onChange={(e) => changeHandler(e)}
                                            maxLength="1" />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            step="0.001"
                                            name='TOI'
                                            className="form-control"
                                            value={toi}
                                            // onChange={e => setToi(e.target.value)}
                                            min={0}
                                            max={999}
                                            onPaste={preventPasteNegative}
                                            onKeyPress={preventMinus}
                                            onFocus={handleFocus}
                                            onChange={(e) => changeHandler(e)}
                                            maxLength="1"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number" step="0.001"
                                            className="form-control"
                                            name='BTO'
                                            value={bto}
                                            // onChange={e => setBto(e.target.value)}
                                            min={0}
                                            max={999} 
                                            onPaste={preventPasteNegative}
                                            onKeyPress={preventMinus}
                                            onFocus={handleFocus}
                                            onChange={(e) => changeHandler(e)}
                                            maxLength="1"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            step="0.001"
                                            className="form-control"
                                            name='NDR'
                                            value={ndr}
                                            // onChange={e => setNdr(e.target.value)}
                                            min={0}
                                            max={999}
                                            onPaste={preventPasteNegative}
                                            onKeyPress={preventMinus}
                                            onFocus={handleFocus}
                                            onChange={(e) => changeHandler(e)}
                                            maxLength="1"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            step="0.001"
                                            className="form-control"
                                            name='GDR'
                                            value={gdr}
                                            // onChange={e => setGdr(e.target.value)}
                                            min={0}
                                            max={999} 
                                            onPaste={preventPasteNegative}
                                            onKeyPress={preventMinus}
                                            onFocus={handleFocus}
                                            onChange={(e) => changeHandler(e)}
                                            maxLength="7"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            step="0.001"
                                            className="form-control"
                                            name='rataKunjungan'
                                            value={rataKunjungan}
                                            // onChange={e => setRataKunjungan(e.target.value)}
                                            min={0}
                                            max={999}
                                            onPaste={preventPasteNegative}
                                            onKeyPress={preventMinus}
                                            onFocus={handleFocus}
                                            onChange={(e) => changeHandler(e)}
                                            maxLength="1"
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="mt-3 mb-3">
                    <ToastContainer />
                    <button type="submit" className="btn btn-outline-success"><HiSaveAs /> Simpan</button>
                </div>
            </form>
        </div>
    )
}

export default FormTambahRL12;