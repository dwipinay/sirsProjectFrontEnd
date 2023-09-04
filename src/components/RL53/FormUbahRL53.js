import React, { useState, useEffect } from "react"
import axios from "axios"
import jwt_decode from 'jwt-decode'
import { useNavigate, useParams } from "react-router-dom"
import style from './FormTambahRL53.module.css'
import { HiSaveAs } from 'react-icons/hi'
import { Link } from "react-router-dom"
import { IoArrowBack } from "react-icons/io5"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Table from 'react-bootstrap/Table';

export const FormUbahRL53 = () => {
    const [tahun, setTahun] = useState('')
    const [namaRS, setNamaRS] = useState('')
    const [alamatRS, setAlamatRS] = useState('')
    const [namaPropinsi, setNamaPropinsi] = useState('')
    const [namaKabKota, setNamaKabKota] = useState('')
    const [kode_icd_10, setKodeIcd10] = useState('')
    const [deskripsi, setDeskripsi] = useState('')
    const [pasienKeluarHidupLK, setPasienKeluarHidupLK] = useState('')
    const [pasienKeluarHidupPR, setPasienKeluarHidupPR] = useState('')
    const [pasienKeluarMatiLK, setPasienKeluarMatiLK] = useState('')
    const [pasienKeluarMatiPR, setPasienKeluarMatiPR] = useState('')
    const [no, setNoUrut] = useState('')
    const [token, setToken] = useState('')
    const [expire, setExpire] = useState('')
    const [setSelected] = useState([]);
    const navigate = useNavigate()
    const { id } = useParams();

    useEffect(() => {
        refreshToken()
        getRLLimaTitikTigaById();
        getIcd10();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
    const changeHandlerSingle = (event) => {
        setTahun(event.target.value)
    }
    const getIcd10 = async () => {
        try {
            const response = await axiosJWT.get('/apisirs/geticd10', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const rlIcd10 = response.data.data.map((value, index) => {
                let labelJumlah = value.code + "-" + value.description
                return {

                    label: labelJumlah,
                    kodeIcd10: value.code,
                    deskripsi: value.description

                }
            })
            setSelected(rlIcd10)
            // console.log(rlIcd10)
        } catch (error) {
        }
    }
    const handleFocus = (event) => event.target.select();

    const changeHandler = (event, index) => {
        const targetName = event.target.name
        switch (targetName) {

            case "pasienKeluarHidupLK":
                if (event.target.value === '') {

                    event.target.value = 0
                    event.target.select(event.target.value)
                }
                setPasienKeluarHidupLK(event.target.value)
                break
            case "pasienKeluarHidupPR":
                if (event.target.value === '') {

                    event.target.value = 0
                    event.target.select(event.target.value)
                }
                setPasienKeluarHidupPR(event.target.value)
                break
            case "pasienKeluarMatiPR":
                if (event.target.value === '') {

                    event.target.value = 0
                    event.target.select(event.target.value)
                }
                setPasienKeluarMatiPR(event.target.value)
                break
            case "pasienKeluarMatiLK":
                if (event.target.value === '') {

                    event.target.value = 0
                    event.target.select(event.target.value)
                }
                setPasienKeluarMatiLK(event.target.value)
                break
            default:
                break
        }
    }

    const getDataRS = async (id) => {
        try {
            const response = await axiosJWT.get('/apisirs/rumahsakit/' + id, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            //console.log(response.data)
            setNamaRS(response.data.data[0].nama)
            setAlamatRS(response.data.data[0].alamat)
            setNamaPropinsi(response.data.data[0].propinsi.nama)
            setNamaKabKota(response.data.data[0].kabKota.nama)
        } catch (error) {

        }
    }
    const updateDataRLLimaTitikTiga = async (e) => {
        e.preventDefault();
        try {
            const customConfig = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
            await axiosJWT.patch('/apisirs/rllimatitiktigadetail/' + id, {
                kode_icd_10,
                deskripsi,
                pasienKeluarHidupLK,
                pasienKeluarHidupPR,
                pasienKeluarMatiLK,
                pasienKeluarMatiPR
            }, customConfig);

            toast('Data Berhasil Diupdate', {
                position: toast.POSITION.TOP_RIGHT
            })
            setTimeout(() => {
                navigate('/rl53')
            }, 1000);
        } catch (error) {
            console.log(error)
            toast('Data Gagal Diupdate', {
                position: toast.POSITION.TOP_RIGHT
            })
        }

    };

    const getRLLimaTitikTigaById = async () => {
        const response = await axiosJWT.get('/apisirs/rllimatitiktigadetail/' + id, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        setNoUrut(response.data.data.rl_lima_titik_Tiga_id);
        setKodeIcd10(response.data.data.kode_icd_10);
        setDeskripsi(response.data.data.deskripsi);
        setPasienKeluarHidupLK(response.data.data.pasien_keluar_hidup_menurut_jeniskelamin_lk);
        setPasienKeluarHidupPR(response.data.data.pasien_keluar_hidup_menurut_jeniskelamin_pr);
        setPasienKeluarMatiLK(response.data.data.pasien_keluar_mati_menurut_jeniskelamin_lk);
        setPasienKeluarMatiPR(response.data.data.pasien_keluar_mati_menurut_jeniskelamin_pr);
       // console.log(response.data.data);
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
    return (
        <div className="container" style={{ marginTop: "70px" }}>
            <form onSubmit={updateDataRLLimaTitikTiga}>
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
                                        placeholder="Tahun" value={tahun} onChange={e => changeHandlerSingle(e)} />
                                    <label htmlFor="floatingInput">Tahun</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-md-12">
                        <Link to={`/rl53/`} className='btn btn-info' style={{fontSize:"18px", backgroundColor: "#779D9E", color: "#FFFFFF"}}>
                            {/* <IoArrowBack size={30} style={{ color: "gray", cursor: "pointer" }} /><span style={{ color: "gray" }}></span> */}
                            &lt;
                            <span style={{ color: "white" }}> RL 5.3 10 Besar Penyakit Rawat Inap</span>
                        </Link>
                        <Table className={style.rlTable}>
                            <thead>
                                <tr>
                                    <th style={{ "width": "6%" }}>No Urut</th>
                                    <th>KODE ICD 10</th>
                                    <th>Deskripsi</th>
                                    <th>Pasien Keluar Hidup Menur Jenis Kelamin LK</th>
                                    <th>Pasien Keluar Hidup Menurut Jenis Kelamin PR</th>
                                    <th>Pasien Keluar Mati Menurut Jenis Kelamin LK</th>
                                    <th>Pasien Keluar Mati Menurut Jenis Kelamin PR</th>
                                </tr>
                            </thead>
                            <tbody>
                                <td><input name="no" type="text" className="form-control" id="floatingInput"
                                    placeholder="no" value={no} onChange={e => changeHandler(e)} disabled={true} />
                                </td>
                                <td><center>{kode_icd_10}</center>
                                </td>
                                <td><center>{deskripsi}</center>
                                </td>
                                <td><div className="control">
                                    <input type="number" name="pasienKeluarHidupLK" min={0} className="form-control" value={pasienKeluarHidupLK} onPaste={preventPasteNegative}
                                        onKeyPress={preventMinus} onFocus={handleFocus} onChange={(e) => changeHandler(e)} />
                                </div>
                                </td>
                                <td><div className="control">
                                    <input type="number" name="pasienKeluarHidupPR" min={0} className="form-control" value={pasienKeluarHidupPR} onPaste={preventPasteNegative}
                                        onKeyPress={preventMinus} onFocus={handleFocus} onChange={(e) => changeHandler(e)} />
                                </div>
                                </td>
                                <td><div className="control">
                                    <input type="number" name="pasienKeluarMatiLK" min={0} className="form-control" value={pasienKeluarMatiLK} onPaste={preventPasteNegative}
                                        onKeyPress={preventMinus} onFocus={handleFocus} onChange={(e) => changeHandler(e)} />
                                </div>
                                </td>
                                <td><div className="control">
                                    <input type="number" name="pasienKeluarMatiPR" min={0} className="form-control" value={pasienKeluarMatiPR} onPaste={preventPasteNegative}
                                        onKeyPress={preventMinus} onFocus={handleFocus} onChange={(e) => changeHandler(e)} />
                                </div>
                                </td>
                            </tbody>
                        </Table>
                    </div>
                </div>
                <div className="mt-3 mb-3">
                    <ToastContainer />
                    <button type="submit" className="btn btn-outline-success"><HiSaveAs /> Update</button>
                </div>
            </form>
        </div>
    )
}
export default FormUbahRL53