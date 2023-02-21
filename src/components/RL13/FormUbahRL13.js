import React, { useState, useEffect } from 'react'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { useNavigate, useParams, Link } from 'react-router-dom'
import style from './FormTambahRL13.module.css'
import { HiSaveAs } from 'react-icons/hi'
import { IoArrowBack } from 'react-icons/io5'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FormUbahRL31 = () => {
    const [namaRS, setNamaRS] = useState('')
    const [alamatRS, setAlamatRS] = useState('')
    const [namaPropinsi, setNamaPropinsi] = useState('')
    const [namaKabKota, setNamaKabKota] = useState('')
    const [jenisPelayanan, setJenisPelayanan] = useState('')
    const [jumlahTempatTidur, setJumlahTempatTidur] = useState(0)
    const [kelasVVIP, setKelasVVIP] = useState(0)
    const [kelasVIP, setKelasVIP] = useState(0)
    const [kelas1, setKelas1] = useState(0)
    const [kelas2, setKelas2] = useState(0)
    const [kelas3, setKelas3] = useState(0)
    const [kelasKhusus, setKelasKhusus] = useState(0)
    const [token, setToken] = useState(0)
    const [expire, setExpire] = useState(0)
    const navigate = useNavigate()
    const { id } = useParams()
    const [buttonStatus, setButtonStatus] = useState(false)

    useEffect(() => {
        refreshToken()
        getDataRLSatuTitikTigaDetailById(id)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const refreshToken = async() => {
        try {
            const response = await axios.get('/apisirs/token')
            setToken(response.data.accessToken)
            const decoded = jwt_decode(response.data.accessToken)
            setExpire(decoded.exp)
            getDataRS(decoded.rsId)
        } catch (error) {
            if(error.response) {
                navigate('/')
            }
        }
    }

    const axiosJWT = axios.create()
    axiosJWT.interceptors.request.use(async(config) => {
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
            setNamaRS(response.data.data[0].nama)
            setAlamatRS(response.data.data[0].alamat)
            setNamaPropinsi(response.data.data[0].propinsi.nama)
            setNamaKabKota(response.data.data[0].kabKota.nama)
        } catch (error) {
            console.log(error)
        }
    }

    const getDataRLSatuTitikTigaDetailById = async (id) => {
        try {
            const response = await axiosJWT.get('/apisirs/rlsatutitiktigadetail/' + id, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(response.data.data)
            setJenisPelayanan(response.data.data.jenis_pelayanan.nama)
            setJumlahTempatTidur(response.data.data.jumlah_tempat_tidur)
            setKelasVVIP(response.data.data.kelas_VVIP)
            setKelasVIP(response.data.data.kelas_VIP)
            setKelas1(response.data.data.kelas_1)
            setKelas2(response.data.data.kelas_2)
            setKelas3(response.data.data.kelas_3)
            setKelasKhusus(response.data.data.kelas_khusus)
        } catch (error) {
            console.log(error)
        }
    }

    const handleFocus = ((event) => {
        event.target.select()
    })

    const changeHandler = (event, index) => {
        const targetName = event.target.name
        switch (targetName) {
            case "jumlahTempatTidur":
                if (event.target.value === '') {
                    event.target.value = 0
                    event.target.select(event.target.value)
                }
                setJumlahTempatTidur(event.target.value)
                break
            case "kelasVVIP":
                if (event.target.value === '') {
                    event.target.value = 0
                    event.target.select(event.target.value)
                }
                setKelasVVIP(event.target.value)
                setJumlahTempatTidur(
                    parseInt(event.target.value) + 
                    parseInt(kelasVIP) +
                    parseInt(kelas1) +
                    parseInt(kelas2) +
                    parseInt(kelas3) +
                    parseInt(kelasKhusus)
                )
                break
            case "kelasVIP":
                if (event.target.value === '') {
                    event.target.value = 0
                    event.target.select(event.target.value)
                }
                setKelasVIP(event.target.value)
                setJumlahTempatTidur(
                    parseInt(event.target.value) + 
                    parseInt(kelasVVIP) +
                    parseInt(kelas1) +
                    parseInt(kelas2) +
                    parseInt(kelas3) +
                    parseInt(kelasKhusus)
                )
                break
            case "kelas1":
                if (event.target.value === '') {
                    event.target.value = 0
                    event.target.select(event.target.value)
                }
                setKelas1(event.target.value)
                setJumlahTempatTidur(
                    parseInt(event.target.value) + 
                    parseInt(kelasVVIP) +
                    parseInt(kelasVIP) +
                    parseInt(kelas2) +
                    parseInt(kelas3) +
                    parseInt(kelasKhusus)
                )
                break
            case "kelas2":
                if (event.target.value === '') {
                    event.target.value = 0
                    event.target.select(event.target.value)
                }
                setKelas2(event.target.value)
                setJumlahTempatTidur(
                    parseInt(event.target.value) + 
                    parseInt(kelasVVIP) +
                    parseInt(kelasVIP) +
                    parseInt(kelas1) +
                    parseInt(kelas3) +
                    parseInt(kelasKhusus)
                )
                break
            case "kelas3":
                if (event.target.value === '') {
                    event.target.value = 0
                    event.target.select(event.target.value)
                }
                setKelas3(event.target.value)
                setJumlahTempatTidur(
                    parseInt(event.target.value) + 
                    parseInt(kelasVVIP) +
                    parseInt(kelasVIP) +
                    parseInt(kelas1) +
                    parseInt(kelas2) +
                    parseInt(kelasKhusus)
                )
                break
            case "kelasKhusus":
                if (event.target.value === '') {
                    event.target.value = 0
                    event.target.select(event.target.value)
                }
                setKelasKhusus(event.target.value)
                setJumlahTempatTidur(
                    parseInt(event.target.value) + 
                    parseInt(kelasVVIP) +
                    parseInt(kelasVIP) +
                    parseInt(kelas1) +
                    parseInt(kelas2) +
                    parseInt(kelas3)
                )
                break
            default:
                break
        }
    }

    const Simpan = async (e) => {
        e.preventDefault()
        setButtonStatus(true)
        try {
            const data = {
                "jumlahTempatTidur": jumlahTempatTidur,
                "kelasVVIP": kelasVVIP,
                "kelasVIP": kelasVIP,
                "kelas1": kelas1,
                "kelas2": kelas2,
                "kelas3": kelas3,
                "kelasKhusus": kelasKhusus
            }

            const customConfig = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }

            await axiosJWT.patch('/apisirs/rlsatutitiktiga/' + id, data, customConfig)
            
            toast('Data Berhasil Diubah', {
                position: toast.POSITION.TOP_RIGHT
            })
            setTimeout(() => {
                navigate('/rl13')
            }, 1000);
        } catch (error) {
            console.log(error)
            toast('Data Gagal Disimpan', {
                position: toast.POSITION.TOP_RIGHT
            })
        }
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

    return (
        <div className="container" style={{marginTop: "70px"}}>
            <form onSubmit={Simpan}>
                <div className="row">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title h5">Profile Fasyankes</h5>
                                <div className="form-floating" style={{width:"100%", display:"inline-block"}}>
                                    <input type="text" className="form-control" id="floatingInput"
                                        value={ namaRS } disabled={true}/>
                                    <label htmlFor="floatingInput">Nama</label>
                                </div>
                                <div className="form-floating" style={{width:"100%", display:"inline-block"}}>
                                    <input type="text" className="form-control" id="floatingInput"
                                        value={ alamatRS} disabled={true}/>
                                    <label htmlFor="floatingInput">Alamat</label>
                                </div>
                                <div className="form-floating" style={{width:"50%", display:"inline-block"}}>
                                    <input type="text" className="form-control" id="floatingInput"
                                        value={ namaPropinsi } disabled={true}/>
                                    <label htmlFor="floatingInput">Provinsi </label>
                                </div>
                                <div className="form-floating" style={{width:"50%", display:"inline-block"}}>
                                    <input type="text" className="form-control" id="floatingInput"
                                        value= { namaKabKota } disabled={true}/>
                                    <label htmlFor="floatingInput">Kab/Kota</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-md-12">
                        <Link to={`/rl13/`} style={{textDecoration: "none"}}>
                            <IoArrowBack size={30} style={{color:"gray",cursor: "pointer"}}/>
                            <span style={{color: "gray"}}>RL 1.3 Tempat Tidur</span>
                        </Link>
                        <table className={style.rlTable}>
                            <thead>
                                <tr>
                                    <th style={{"width": "4%"}}>No.</th>
                                    <th style={{"width": "20%"}}>Jenis Pelayanan</th>
                                    <th>Jumlah Tempat Tidur</th>
                                    <th>VVIP</th>
                                    <th>VIP</th>
                                    <th>1</th>
                                    <th>2</th>
                                    <th>3</th>
                                    <th>Khusus</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <input type='text' name='id' className="form-control" value="1" disabled={true}/>
                                    </td>
                                    <td>
                                        <input type="text" name="jenisPelayanan" className="form-control" value={jenisPelayanan} disabled={true} />
                                    </td>
                                    <td><input type="number" name="jumlahTempatTidur" className="form-control" value={jumlahTempatTidur} 
                                        onFocus={handleFocus} onChange={event => changeHandler(event)} disabled={true} min={0} onPaste={preventPasteNegative}
                                        onKeyPress={preventMinus}/>
                                    </td>
                                    <td><input type="number" name="kelasVVIP" className="form-control" value={kelasVVIP} 
                                        onFocus={handleFocus} onChange={event => changeHandler(event)} disabled={false} min={0} onPaste={preventPasteNegative}
                                        onKeyPress={preventMinus}/>
                                    </td>
                                    <td><input type="number" name="kelasVIP" className="form-control" value={kelasVIP} 
                                        onFocus={handleFocus} onChange={event => changeHandler(event)} disabled={false} min={0} onPaste={preventPasteNegative}
                                        onKeyPress={preventMinus}/>
                                    </td>
                                    <td><input type="number" name="kelas1" className="form-control" value={kelas1} 
                                        onFocus={handleFocus} onChange={event => changeHandler(event)} disabled={false} min={0} onPaste={preventPasteNegative}
                                        onKeyPress={preventMinus}/>
                                    </td>
                                    <td><input type="number" name="kelas2" className="form-control" value={kelas2} 
                                        onFocus={handleFocus} onChange={event => changeHandler(event)} disabled={false} min={0} onPaste={preventPasteNegative}
                                        onKeyPress={preventMinus}/>
                                    </td>
                                    <td><input type="number" name="kelas3" className="form-control" value={kelas3} 
                                        onFocus={handleFocus} onChange={event => changeHandler(event)} disabled={false} min={0} onPaste={preventPasteNegative}
                                        onKeyPress={preventMinus}/>
                                    </td>
                                    <td><input type="number" name="kelasKhusus" className="form-control" value={kelasKhusus} 
                                        onFocus={handleFocus} onChange={event => changeHandler(event)} disabled={false} min={0} onPaste={preventPasteNegative}
                                        onKeyPress={preventMinus}/>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="mt-3 mb-3">
                    <ToastContainer />
                    <button type="submit" className="btn btn-outline-success" disabled={buttonStatus}><HiSaveAs/> Simpan</button>
                </div>
            </form>
            
        </div>
    )
}

export default FormUbahRL31