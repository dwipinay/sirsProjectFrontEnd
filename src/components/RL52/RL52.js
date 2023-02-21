import React, { useState, useEffect } from 'react'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { useNavigate, Link } from 'react-router-dom'
import style from './FormTambahRL52.module.css'
import { HiSaveAs } from 'react-icons/hi'
import { RiDeleteBin5Fill, RiEdit2Fill } from 'react-icons/ri'
import { AiFillFileAdd } from 'react-icons/ai'
import { confirmAlert } from 'react-confirm-alert'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import 'react-confirm-alert/src/react-confirm-alert.css'
import Spinner from 'react-bootstrap/Spinner'

const RL52 = () => {
    const [tahun, setTahun] = useState('2022')
    const [bulan, setBulan] = useState('01')
    const [namaRS, setNamaRS] = useState('')
    const [alamatRS, setAlamatRS] = useState('')
    const [namaPropinsi, setNamaPropinsi] = useState('')
    const [namaKabKota, setNamaKabKota] = useState('')
    const [dataRL, setDataRL] = useState([])
    const [token, setToken] = useState('')
    const [expire, setExpire] = useState('')
    const navigate = useNavigate()
    const [spinner, setSpinner]= useState(false)

    useEffect(() => {
        refreshToken()
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
            
        }
    }

    // const getRLLimaTitikDuaTemplate = async() => {
    //     setSpinner(true)
    //     try {
    //         const response = await axiosJWT.get('/apisirs/jeniskegiatan?rlid=22', {
    //             headers: {
    //                 Authorization: `Bearer ${token}`
    //             }
    //         })
            
    //         const rlTemplate = response.data.data.map((value, index) => {
    //             return {
    //                 id: value.id,
    //                 no: value.no,
    //                 jenisKegiatan: value.nama,
    //                 jumlah: 0,
    //                 disabledInput: true,
    //                 checked: false
    //             }
    //         })
    //         setDataRL(rlTemplate)
    //         setSpinner(false)
    //     } catch (error) {
    //         console.log(error)
    //         setSpinner(false)
    //     }
    // }

    const changeHandlerSingle = (event) => {
        const name = event.target.name
        if (name === 'tahun') {
            setTahun(event.target.value)
        } else if (name === 'bulan') {
            setBulan(event.target.value)
        }
    }

    const changeHandler = (event, index) => {
        const name = event.target.name
        if (name === 'check') {
            if (event.target.checked === true) {
                hapus()
            } else if (event.target.checked === false) {
                // console.log('hello2')
            }
        }
    }

    const Cari = async (e) => {
        let date = (tahun+'-'+bulan+'-01')
        // console.log(date)
        e.preventDefault()
        setSpinner(true)
        try {
            const customConfig = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                params: {
                    tahun: date
                }
            }
            const results = await axiosJWT.get('/apisirs/rllimatitikdua',
                customConfig)
            
            // console.log(results)

            const rlLimaTitikDuaDetails = results.data.data.map((value) => {
                return value.rl_lima_titik_dua_details
            })

            let dataRLLimaTitikDuaDetails = []
            rlLimaTitikDuaDetails.forEach(element => {
                element.forEach(value => {
                    dataRLLimaTitikDuaDetails.push(value)
                })
            })

            setDataRL(dataRLLimaTitikDuaDetails)
            // console.log(dataRLLimaTitikDuaDetails)
            // console.log(dataRL)
            setSpinner(false)
        } catch (error) {
            console.log(error)
            setSpinner(false)
        }
    }

    const hapusData = async(id) => {
        const customConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
        try {
            await axiosJWT.delete(`/apisirs/rllimatitikdua/${id}`,
                customConfig)
            setDataRL((current) =>
                current.filter((value) => value.id !== id)
            )
            toast('Data Berhasil Dihapus', {
                position: toast.POSITION.TOP_RIGHT
            })
        } catch (error) {
            console.log(error)
            toast('Data Gagal Disimpan', {
                position: toast.POSITION.TOP_RIGHT
            })
        }
    }

    const hapus = (id) => {
        confirmAlert({
            title: 'Konfirmasi Penghapusan',
            message: 'Apakah Anda Yakin? ',
            buttons: [
                {
                    label: 'Ya',
                    onClick: () => {
                        hapusData(id)
                    }
                },
                {
                    label: 'Tidak'
                }
            ]
        })
    }

    return (
        <div className="container" style={{marginTop: "70px"}}>
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
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title h5">Periode Laporan</h5>
                                <form onSubmit={Cari}>
                                    <div className="form-floating" style={{width:"100%", display:"inline-block"}}>
                                        {/* <input name="tahun" type="text" className="form-control" id="floatingInput" 
                                            placeholder="Tahun" value={tahun} onChange={e => changeHandlerSingle(e)}/> */}
                                        <select name="tahun" className="form-control" id="tahun" onChange={e => changeHandlerSingle(e)}>
                                            <option value="2022">2022</option>
                                            <option value="2023">2023</option>
                                        </select>
                                        <label htmlFor="tahun">Tahun</label>
                                    </div>
                                    <div className="form-floating" style={{width:"100%", display:"inline-block"}}>
                                        <select name="bulan" className="form-control" id="bulan" onChange={e => changeHandlerSingle(e)}>
                                            <option value="01">Januari</option>
                                            <option value="02">Februari</option>
                                            <option value="03">Maret</option>
                                            <option value="04">April</option>
                                            <option value="05">Mei</option>
                                            <option value="06">Juni</option>
                                            <option value="07">Juli</option>
                                            <option value="08">Agustus</option>
                                            <option value="09">September</option>
                                            <option value="10">Oktober</option>
                                            <option value="11">November</option>
                                            <option value="12">Desember</option>
                                        </select>
                                        <label htmlFor="bulan">Bulan</label>
                                    </div>
                                    <div className="mt-3 mb-3">
                                        <button type="submit" className="btn btn-outline-success"><HiSaveAs/> Cari</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row mt-3 mb-3">
                    <div className="col-md-12">
                        <Link to={`/rl52/tambah/`} style={{textDecoration: "none"}}>
                            <AiFillFileAdd size={30} style={{color:"gray",cursor: "pointer"}}/>
                            <span style={{color:"gray"}}>RL 5.2 -  Kunjungan Rawat Jalan</span>
                        </Link>
                        <div className="container" style={{ textAlign: "center" }}>
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
                                    <th style={{"width": "5%"}}>No.</th>
                                    <th style={{"width": "5%"}}>Aksi</th>
                                    <th style={{"width": "40%"}}>Jenis Kegiatan</th>
                                    <th>Jumlah</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataRL.map((value, index) => {
                                    return (
                                        <tr key={value.id}>
                                            <td>
                                                <input type='text' name='id' className="form-control" value={index + 1} disabled={true}/>
                                            </td>
                                            <td style={{textAlign: "center", verticalAlign: "middle"}}>
                                                <ToastContainer />
                                                <RiDeleteBin5Fill  size={20} onClick={(e) => hapus(value.id)} style={{color: "gray", cursor: "pointer", marginRight: "5px"}} />
                                                <Link to={`/rl52/ubah/${value.id}`}>
                                                    <RiEdit2Fill size={20} style={{color:"gray",cursor: "pointer"}}/>
                                                </Link>
                                            </td>
                                            <td>
                                                <input type="text" name="jenisKegiatan" className="form-control" value={value.jenis_kegiatan.nama} disabled={true} />
                                            </td>
                                            <td>
                                                <input type="text" name="jumlah" className="form-control" value={value.jumlah} 
                                                onChange={e => changeHandler(e, index)} disabled={true} />
                                            </td>
                                        </tr>
                                    )
                                }) }
                            </tbody>
                        </table>
                    </div>
                </div>
        </div>
    )
    
}

export default RL52