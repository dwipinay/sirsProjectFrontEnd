import React, { useState, useEffect } from 'react'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import style from './FormTambahRL32.module.css'
import { HiSaveAs } from 'react-icons/hi'
import { RiDeleteBin5Fill, RiEdit2Fill } from 'react-icons/ri'
import { AiFillFileAdd } from 'react-icons/ai'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'
//import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom'
import { Spinner } from 'react-bootstrap'


const RL32 = () => {
    const [tahun, setTahun] = useState('')
    const [namaRS, setNamaRS] = useState('')
    const [alamatRS, setAlamatRS] = useState('')
    const [namaPropinsi, setNamaPropinsi] = useState('')
    const [namaKabKota, setNamaKabKota] = useState('')
    const [dataRL, setDataRL] = useState([])
    const [token, setToken] = useState('')
    const [expire, setExpire] = useState('')
    const navigate = useNavigate()
    const [spinner, setSpinner] = useState(false)

    useEffect(() => {
        refreshToken()
        const getLastYear = async () =>{
            const date = new Date()
            setTahun(date.getFullYear() - 1)
            return date.getFullYear() - 1
        }
        getLastYear().then((results) => {
            getDataRLTigaTitikDua(results)
        })

        // getRLTigaTitikDuaTemplate()
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
            // console.log(response.data)
            setNamaRS(response.data.data[0].nama)
            setAlamatRS(response.data.data[0].alamat)
            setNamaPropinsi(response.data.data[0].propinsi.nama)
            setNamaKabKota(response.data.data[0].kabKota.nama)
        } catch (error) {
            
        }
    }

    const getDataRLTigaTitikDua = async (event) => {
        setSpinner(true)
        try {
            const customConfig = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                params: {
                    tahun: event
                }
            }
            const results = await axiosJWT.get('/apisirs/rltigatitikdua',
                customConfig)

            const rlTigaTitikDuaDetails = results.data.data.map((value) => {
                return value.rl_tiga_titik_dua_details
            })

            let dataRLTigaTitikDuaDetails = []
            rlTigaTitikDuaDetails.forEach(element => {
                element.forEach(value => {
                    dataRLTigaTitikDuaDetails.push(value)
                })
            })
            setDataRL(dataRLTigaTitikDuaDetails)
            setSpinner(false)
        } catch (error) {
            console.log(error)
        }
    }

    const getRLTigaTitikDuaTemplate = async() => {
        try {
            const response = await axiosJWT.get('/jenispelayanan?rlid=2', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            
            const rlTemplate = response.data.data.map((value, index) => {
                return {
                    id: value.no,
                    jenisPelayanan: value.nama,
                    totalPasienRujukan: 0,
                    totalPasienNonRujukan: 0,
                    tindakLanjutPelayananDirawat: 0,
                    tindakLanjutPelayananDirujuk: 0,
                    tindakLanjutPelayananPulang: 0,
                    matiDiUGD: 0,
                    doa: 0,
                    disabledInput: true,
                    checked: false
                }
            })
            setDataRL(rlTemplate)
        } catch (error) {
            
        }
    }

    const changeHandlerSingle = (event) => {
        setTahun(event.target.value)
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
        e.preventDefault()
        try {
            const customConfig = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                params: {
                    tahun: tahun
                }
            }
            const results = await axiosJWT.get('/apisirs/rltigatitikdua',
                customConfig)
            
            // console.log(results)

            const rlTigaTitikDuaDetails = results.data.data.map((value) => {
                return value.rl_tiga_titik_dua_details
            })

            let dataRLTigaTitikDuaDetails = []
            rlTigaTitikDuaDetails.forEach(element => {
                element.forEach(value => {
                    dataRLTigaTitikDuaDetails.push(value)
                })
            })

            setDataRL(dataRLTigaTitikDuaDetails)
            // console.log(dataRLTigaTitikDuaDetails)
            // console.log(dataRL)
        } catch (error) {
            console.log(error)
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
            const results = await axiosJWT.delete(`/apisirs/rltigatitikdua/${id}`,
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
            message: 'Apakah Anda Yakin ?',
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
                                        <input name="tahun" type="text" className="form-control" id="floatingInput" 
                                            placeholder="Tahun" value={tahun} onChange={e => changeHandlerSingle(e)}/>
                                        <label htmlFor="floatingInput">Tahun</label>
                                    </div>
                                    <div className="mt-3 mb-3">
                                        <button type="submit" className="btn btn-outline-success"><HiSaveAs/> Cari</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <Link to={`/rl32/tambah/`} style={{textDecoration: "none"}}>
                    <AiFillFileAdd size={30} style={{color:"gray",cursor: "pointer"}}/><span style={{color: "gray"}}>RL 3.2 Rawat Darurat</span>
                </Link>
                <div className="row mt-3 mb-3">
                    <div className="col-md-12">
                    <div className="container" style={{textAlign:"center"}}>
                            {/* {spinner && <Spinner animation="border" variant="secondary"></Spinner>} */}
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
                                    <th style={{"width": "4%"}}>No. Pelayanan</th>
                                    <th style={{"width": "5%"}}>Aksi</th>
                                    <th style={{"width": "20%"}}>Jenis Pelayanan</th>
                                    <th>Total Pasien Rujukan</th>
                                    <th>Total Pasien Non Rujukan</th>
                                    <th>Tindak Lanjut Pelayanan Dirawat</th>
                                    <th>Tindak Lanjut Pelayanan Dirujuk</th>
                                    <th>Tindak Lanjut Pelayanan Pulang</th>
                                    <th>Mati Di UGD</th>
                                    <th>DOA</th>
                                </tr>
                            </thead>
                            <tbody> 
                                {dataRL.map((value, index) => {
                                    return (
                                        <tr key={value.id}>
                                        <td>
                                            <input type="text" name="no" className="form-control" value={value.jenis_pelayanan.no} disabled={true} />
                                            {/* <input type='text' name='id' className="form-control" value={index + 1} disabled={true}/> */}
                                        </td>
                                        <td style={{textAlign: "center", verticalAlign: "middle"}}>
                                            <ToastContainer />
                                            <RiDeleteBin5Fill  size={20} onClick={(e) => hapus(value.id)} style={{color: "gray", cursor: "pointer", marginRight: "5px"}} />
                                                <Link to={`/rl32/ubah/${value.id}`}>
                                                    <RiEdit2Fill size={20} style={{color:"gray",cursor: "pointer"}}/>
                                                </Link>
                                        </td>
                                        <td>
                                            <input type="text" name="jenisPelayanan" className="form-control" value={value.jenis_pelayanan.nama} disabled={true} />
                                        </td>
                                        <td>
                                            <input type="text" name="totalPasienRujukan" className="form-control" value={value.total_pasien_rujukan} 
                                            onChange={e => changeHandler(e, index)} disabled={true} />
                                        </td>
                                        <td>
                                            <input type="text" name="totalPasienNonRujukan" className="form-control" value={value.total_pasien_non_rujukan} 
                                            onChange={e => changeHandler(e, index)} disabled={true} />
                                        </td>
                                        <td>
                                            <input type="text" name="tindakLanjutPelayananDirawat" className="form-control" value={value.tindak_lanjut_pelayanan_dirawat} 
                                            onChange={e => changeHandler(e, index)} disabled={true} />
                                        </td>
                                        <td>
                                            <input type="text" name="tindakLanjutPelayananDirujuk" className="form-control" value={value.tindak_lanjut_pelayanan_dirujuk} 
                                            onChange={e => changeHandler(e, index)} disabled={true} />
                                        </td>
                                        <td>
                                            <input type="text" name="tindakLanjutPelayananPulang" className="form-control" value={value.tindak_lanjut_pelayanan_pulang} 
                                            onChange={e => changeHandler(e, index)} disabled={true} />
                                        </td>
                                        <td>
                                            <input type="text" name="matiDiUGD" className="form-control" value={value.mati_di_ugd} 
                                            onChange={e => changeHandler(e, index)} disabled={true} />
                                        </td>
                                        <td>
                                            <input type="text" name="doa" className="form-control" value={value.doa} 
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

export default RL32