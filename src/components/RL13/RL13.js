import React, { useState, useEffect } from 'react'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { useNavigate, Link } from 'react-router-dom'
import style from './FormTambahRL13.module.css'
import { HiSaveAs } from 'react-icons/hi'
import { RiDeleteBin5Fill, RiEdit2Fill } from 'react-icons/ri'
import { AiFillFileAdd } from 'react-icons/ai'
import { confirmAlert } from 'react-confirm-alert'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import 'react-confirm-alert/src/react-confirm-alert.css'
import Table from 'react-bootstrap/Table'

const RL13 = () => {
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
            getDataRLSatuTitikTiga(results)
        })
        
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
            const response = await axiosJWT.get('/apisirs/rumahsakit/' + id)
            setNamaRS(response.data.data[0].nama)
            setAlamatRS(response.data.data[0].alamat)
            setNamaPropinsi(response.data.data[0].propinsi.nama)
            setNamaKabKota(response.data.data[0].kabKota.nama)
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
                
            }
        }
    }

    const getDataRLSatuTitikTiga = async (event) => {
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
            const results = await axiosJWT.get('/apisirs/rlsatutitiktiga',
                customConfig)

            const rlSatuTitikTigaDetails = results.data.data.map((value) => {
                return value.rl_satu_titik_tiga_details
            })

            let dataRLSatuTitikTigaDetails = []
            rlSatuTitikTigaDetails.forEach(element => {
                element.forEach(value => {
                    dataRLSatuTitikTigaDetails.push(value)
                })
            })
            setDataRL(dataRLSatuTitikTigaDetails)
        } catch (error) {
            console.log(error)
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
            const results = await axiosJWT.get('/apisirs/rlsatutitiktiga',
                customConfig)

            const rlSatuTitikTigaDetails = results.data.data.map((value) => {
                return value.rl_satu_titik_tiga_details
            })

            let dataRLSatuTitikTigaDetails = []
            rlSatuTitikTigaDetails.forEach(element => {
                element.forEach(value => {
                    dataRLSatuTitikTigaDetails.push(value)
                })
            })

            setDataRL(dataRLSatuTitikTigaDetails)
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
            await axiosJWT.delete(`/apisirs/rlsatutitiktiga/${id}`,
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
                    label: 'Yes',
                    onClick: () => {
                        hapusData(id)
                    }
                },
                {
                    label: 'No'
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
                                    <input type="text" className="form-control" id="namaRS"
                                        value={ namaRS } disabled={true}/>
                                    <label htmlFor='namaRS'>Nama</label>
                                </div>
                                <div className="form-floating" style={{width:"100%", display:"inline-block"}}>
                                    <input type="text" className="form-control" id="alamatRS"
                                        value={ alamatRS} disabled={true}/>
                                    <label htmlFor="alamatRS">Alamat</label>
                                </div>
                                <div className="form-floating" style={{width:"50%", display:"inline-block"}}>
                                    <input type="text" className="form-control" id="provinsiRS"
                                        value={ namaPropinsi } disabled={true}/>
                                    <label htmlFor="provinsiRS">Provinsi </label>
                                </div>
                                <div className="form-floating" style={{width:"50%", display:"inline-block"}}>
                                    <input type="text" className="form-control" id="kabKotaRS"
                                        value= { namaKabKota } disabled={true}/>
                                    <label htmlFor="kabKotaRS">Kab/Kota</label>
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
                                        <input name="tahun" type="text" className="form-control" id="tahun" 
                                            placeholder="Tahun" value={tahun} onChange={e => changeHandlerSingle(e)} disabled={false}/>
                                        <label htmlFor="tahun">Tahun</label>
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
                        <Link to={`/rl13/tambah/`} style={{textDecoration: "none", display: "flex"}}>
                            <AiFillFileAdd size={30} style={{color:"gray",cursor: "pointer"}}/>
                                <span style={{color: "gray"}}>RL 1.3 Tempat Tidur</span>
                        </Link>

                        <Table className={style.rlTable} responsive bordered style={{widows: "100%"}}>
                            <thead>
                                <tr>
                                    <th rowSpan="2" style={{"width": "4%"}}>No.</th>
                                    <th rowSpan="2" style={{"width": "5%"}}></th>
                                    <th rowSpan="2" style={{"width": "30%"}}>Jenis Pelayanan</th>
                                    <th rowSpan="2" style={{"width": "15%"}}>Jumlah Tempat Tidur</th>
                                    <th colSpan="6">Kelas</th>
                                </tr>
                                <tr>
                                    <th style={{"width": "7%"}}>VVIP</th>
                                    <th style={{"width": "7%"}}>VIP</th>
                                    <th style={{"width": "7%"}}>1</th>
                                    <th style={{"width": "7%"}}>2</th>
                                    <th style={{"width": "7%"}}>3</th>
                                    <th style={{"width": "7%"}}>Khusus</th>
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
                                                <Link to={`/rl13/ubah/${value.id}`}>
                                                    <RiEdit2Fill size={20} style={{color:"gray",cursor: "pointer"}}/>
                                                </Link>
                                            </td>
                                            <td>
                                                <input type="text" name="jenisPelayanan" className="form-control" value={value.jenis_pelayanan.nama} disabled={true} />
                                            </td>
                                            <td><input type="text" name="jumlahTempatTidur" className="form-control" value={value.jumlah_tempat_tidur} 
                                                onChange={e => changeHandler(e, index)} disabled={true} />
                                            </td>
                                            <td><input type="text" name="kelasVVIP" className="form-control" value={value.kelas_VVIP} 
                                                onChange={e => changeHandler(e, index)} disabled={true} />
                                            </td>
                                            <td><input type="text" name="kelasVIP" className="form-control" value={value.kelas_VIP} 
                                                onChange={e => changeHandler(e, index)} disabled={true} />
                                            </td>
                                            <td><input type="text" name="kelas1" className="form-control" value={value.kelas_1} 
                                                onChange={e => changeHandler(e, index)} disabled={true} />
                                            </td>
                                            <td><input type="text" name="kelas2" className="form-control" value={value.kelas_2} 
                                                onChange={e => changeHandler(e, index)} disabled={true} />
                                            </td>
                                            <td><input type="text" name="kelas3" className="form-control" value={value.kelas_3} 
                                                onChange={e => changeHandler(e, index)} disabled={true} />
                                            </td>
                                            <td><input type="text" name="kelasKhusus" className="form-control" value={value.kelas_khusus} 
                                                onChange={e => changeHandler(e, index)} disabled={true} />
                                            </td>
                                        </tr>
                                    )
                                }) }
                            </tbody>
                        </Table>
                    </div>
                </div>
        </div>
    )
}

export default RL13