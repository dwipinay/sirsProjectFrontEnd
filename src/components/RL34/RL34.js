import React, { useState, useEffect } from 'react'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { useNavigate, Link } from 'react-router-dom'
import style from './FormTambahRL34.module.css'
import { HiSaveAs } from 'react-icons/hi'
import { RiDeleteBin5Fill, RiEdit2Fill } from 'react-icons/ri'
import { AiFillFileAdd } from 'react-icons/ai'
import { confirmAlert } from 'react-confirm-alert'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import 'react-confirm-alert/src/react-confirm-alert.css'

const RL34 = () => {
    const [tahun, setTahun] = useState('')
    const [namaRS, setNamaRS] = useState('')
    const [alamatRS, setAlamatRS] = useState('')
    const [namaPropinsi, setNamaPropinsi] = useState('')
    const [namaKabKota, setNamaKabKota] = useState('')
    const [dataRL, setDataRL] = useState([])
    const [token, setToken] = useState('')
    const [expire, setExpire] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        refreshToken()
        const getLastYear = async () =>{
            const date = new Date()
            setTahun(date.getFullYear() - 1)
            return date.getFullYear() - 1
        }
        getLastYear().then((results) => {
            getDataRLTigaTitikEmpat(results)
        })
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

    const getDataRLTigaTitikEmpat = async (event) => {
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
            const results = await axiosJWT.get('/apisirs/rltigatitikempat',
                customConfig)

            const rlTigaTitikEmpatDetails = results.data.data.map((value) => {
                return value.rl_tiga_titik_empat_details
            })

            let dataRLTigaTitikEmpatDetails = []
            rlTigaTitikEmpatDetails.forEach(element => {
                element.forEach(value => {
                    dataRLTigaTitikEmpatDetails.push(value)
                })
            })
            setDataRL(dataRLTigaTitikEmpatDetails)
        } catch (error) {
            console.log(error)
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
                console.log('hello2')
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
            const results = await axiosJWT.get('/apisirs/rltigatitikempat',
                customConfig)
            
            // console.log(results)

            const rlTigaTitikEmpatDetails = results.data.data.map((value) => {
                return value.rl_tiga_titik_empat_details
            })

            let dataRLTigaTitikEmpatDetails = []
            rlTigaTitikEmpatDetails.forEach(element => {
                element.forEach(value => {
                    dataRLTigaTitikEmpatDetails.push(value)
                })
            })

            setDataRL(dataRLTigaTitikEmpatDetails)
            console.log(dataRLTigaTitikEmpatDetails)
            console.log(dataRL)
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
            const results = await axiosJWT.delete(`/apisirs/rltigatitikempat/${id}`,
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
                                        <input name="tahun" type="text" className="form-control" id="floatingInput" 
                                            placeholder="Tahun" value={tahun} onChange={e => changeHandlerSingle(e)} />
                                        <label htmlFor="floatingInput">Tahun</label>
                                    </div>
                                    <div className="mt-3 mb-3">
                                        <button type="submit" className="btn btn-outline-success"><HiSaveAs size={20}/> Cari</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row mt-3 mb-3">
                    <div className="col-md-12">
                        <Link to={`/rl34/tambah/`} className='btn btn-info' style={{fontSize:"18px", backgroundColor: "#779D9E", color: "#FFFFFF"}}>
                            {/* <AiFillFileAdd size={30} style={{color:"gray",cursor: "pointer"}}/>
                            <span style={{color:"gray"}}>RL 3.4 -  Kebidanan</span> */}
                            +
                        </Link>
                        <span style={{color:"gray"}}>RL 3.4 -  Kebidanan</span>
                        <table className={style.rlTable}>
                            <thead>
                                <tr>
                                    <th style={{"width": "4%"}}>No.</th>
                                    <th style={{"width": "5%"}}>Aksi</th>
                                    <th style={{"width": "15%"}}>Jenis Kegiatan</th>
                                    <th style={{"width": "5%"}}>RM Rumah Sakit</th>
                                    <th style={{"width": "5%"}}>RM Bidan</th>
                                    <th style={{"width": "5%"}}>RM Puskesmas</th>
                                    <th style={{"width": "5%"}}>RM Faskes Lainnya</th>
                                    <th style={{"width": "5%"}}>RM Hidup</th>
                                    <th style={{"width": "5%"}}>RM Mati</th>
                                    <th style={{"width": "5%"}}>RM Total</th>
                                    <th style={{"width": "5%"}}>RNM Hidup</th>
                                    <th style={{"width": "5%"}}>RNM Mati</th>
                                    <th style={{"width": "5%"}}>RNM Total</th>
                                    <th style={{"width": "5%"}}>NR Hidup</th>
                                    <th style={{"width": "5%"}}>NR Mati</th>
                                    <th style={{"width": "5%"}}>NR Total</th>
                                    <th style={{"width": "5%"}}>Dirujuk</th>
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
                                                {/* <RiDeleteBin5Fill  size={20} onClick={(e) => hapus(value.id)} style={{color: "gray", cursor: "pointer", marginRight: "5px"}} /> */}
                                                {value.jenis_kegiatan.nama !== "Tidak Ada Data" &&
                                                <div style={{display: "flex"}}>
                                                    <button className="btn btn-danger" style={{margin: "0 5px 0 0", backgroundColor: "#FF6663", border: "1px solid #FF6663"}} type='button' onClick={(e) => hapus(value.id)}>H</button>
                                                    <Link to={`/rl34/ubah/${value.id}`} className='btn btn-warning' style={{margin: "0 5px 0 0", backgroundColor: "#CFD35E", border: "1px solid #CFD35E", color:"#FFFFFF"}} >
                                                        U
                                                    </Link>
                                                </div>
                                                }
                                            </td>
                                            <td>
                                                <input type="text" name="jenisKegiatan" className="form-control" value={value.jenis_kegiatan.nama} disabled={true} />
                                            </td>
                                            <td><input type="text" name="rmRumahSakit" className="form-control" value={value.rmRumahSakit} 
                                                        onChange={e => changeHandler(e, index)} disabled={true} /></td>
                                            <td><input type="text" name="rmBidan" className="form-control" value={value.rmBidan} 
                                                        onChange={e => changeHandler(e, index)} disabled={true} /></td>
                                            <td><input type="text" name="rmPuskesmas" className="form-control" value={value.rmPuskesmas} 
                                                        onChange={e => changeHandler(e, index)} disabled={true} /></td>
                                            <td><input type="text" name="rmFaskesLainnya" className="form-control" value={value.rmFaskesLainnya} 
                                                        onChange={e => changeHandler(e, index)} disabled={true} /></td>
                                            <td><input type="text" name="rmHidup" className="form-control" value={value.rmHidup} 
                                                        onChange={e => changeHandler(e, index)} disabled={true} /></td>
                                            <td><input type="text" name="rmMati" className="form-control" value={value.rmMati} 
                                                        onChange={e => changeHandler(e, index)} disabled={true} /></td>
                                            <td><input type="text" name="rmTotal" className="form-control" value={value.rmTotal} 
                                                        onChange={e => changeHandler(e, index)} disabled={true} /></td>
                                            <td><input type="text" name="rnmHidup" className="form-control" value={value.rnmHidup} 
                                                        onChange={e => changeHandler(e, index)} disabled={true} /></td>
                                            <td><input type="text" name="rnmMati" className="form-control" value={value.rnmMati} 
                                                        onChange={e => changeHandler(e, index)} disabled={true} /></td>
                                            <td><input type="text" name="rnmTotal" className="form-control" value={value.rnmTotal} 
                                                        onChange={e => changeHandler(e, index)} disabled={true} /></td>
                                            <td><input type="text" name="nrHidup" className="form-control" value={value.nrHidup} 
                                                        onChange={e => changeHandler(e, index)} disabled={true} /></td>
                                            <td><input type="text" name="nrMati" className="form-control" value={value.nrMati} 
                                                        onChange={e => changeHandler(e, index)} disabled={true} /></td>
                                            <td><input type="text" name="nrTotal" className="form-control" value={value.nrTotal} 
                                                        onChange={e => changeHandler(e, index)} disabled={true} /></td>
                                            <td><input type="text" name="dirujuk" className="form-control" value={value.dirujuk} 
                                                        onChange={e => changeHandler(e, index)} disabled={true} /></td>
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

export default RL34