import React, { useState, useEffect } from 'react'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import style from './FormTambahRL310.module.css'
import { RiDeleteBin5Fill, RiEdit2Fill } from 'react-icons/ri'
import { HiSaveAs } from 'react-icons/hi'
import { AiFillFileAdd } from 'react-icons/ai'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'
import { Link } from 'react-router-dom'
import Spinner from "react-bootstrap/esm/Spinner";



const RL310 = () => {
    const [tahun, setTahun] = useState('')
    const [namaRS, setNamaRS] = useState('')
    const [alamatRS, setAlamatRS] = useState('')
    const [namaPropinsi, setNamaPropinsi] = useState('')
    const [namaKabKota, setNamaKabKota] = useState('')
    const [dataRL, setDataRL] = useState([])
    const [token, setToken] = useState('')
    const [expire, setExpire] = useState('')
    const [spinner, setSpinner] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        refreshToken()

        const getLastYear = async () => {
            const date = new Date()
            setTahun(date.getFullYear() - 1)
            return date.getFullYear() - 1
        }
        getLastYear().then((results) => {
            getDataRLTigaTitikSepuluh(results)
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const getDataRLTigaTitikSepuluh = async (event) => {
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
            const results = await axiosJWT.get('/apisirs/rltigatitiksepuluh',
                customConfig)

            const rlTigaTitikSepuluhDetails = results.data.data.map((value) => {
                return value.rl_tiga_titik_sepuluh_details
            })

            let dataRLTigaTitikSepuluhDetails = []
            rlTigaTitikSepuluhDetails.forEach(element => {
                element.forEach(value => {
                    dataRLTigaTitikSepuluhDetails.push(value)
                })
            })
            let sortedProducts = dataRLTigaTitikSepuluhDetails.sort((p1, p2) =>
                p1.jenis_kegiatan.no > p2.jenis_kegiatan.no
                    ? 1
                    : p1.jenis_kegiatan.no < p2.jenis_kegiatan.no
                        ? -1
                        : 0
            );
           // console.log(sortedProducts)
            setDataRL(dataRLTigaTitikSepuluhDetails)
            setSpinner(false)
        } catch (error) {
            console.log(error)
        }
    }


    const changeHandlerSingle = (event) => {
        setTahun(event.target.value)
    }

    const changeHandler = (event, index) => {
        let newDataRL = [...dataRL]
        const name = event.target.name
        if (name === 'check') {
            if (event.target.checked === true) {
                newDataRL[index].disabledInput = false
            } else if (event.target.checked === false) {
                newDataRL[index].disabledInput = true
            }
            newDataRL[index].checked = event.target.checked

        } else if (name === 'no') {
            newDataRL[index].no = event.target.value
        } else if (name === 'jenisKegiatan') {
            newDataRL[index].jenisKegiatan = event.target.value
        } else if (name === 'jumlah') {
            newDataRL[index].jumlah = event.target.value
        }
        setDataRL(newDataRL)
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
            const results = await axiosJWT.get('/apisirs/rltigatitiksepuluh',
                customConfig)


            const rlTigaTitikSepuluhDetails = results.data.data.map((value) => {
                return value.rl_tiga_titik_sepuluh_details
            })

            let datarlTigaTitikSepuluhDetails = []
            rlTigaTitikSepuluhDetails.forEach(element => {
                element.forEach(value => {
                    datarlTigaTitikSepuluhDetails.push(value)
                })
            })

            setDataRL(datarlTigaTitikSepuluhDetails)
           // console.log(datarlTigaTitikSepuluhDetails)
           // console.log(dataRL)
        } catch (error) {
            console.log(error)
        }
    }

    const hapusData = async (id) => {
        const customConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
        try {
            await axiosJWT.delete(`/apisirs/rlTigaTitikSepuluhdetail/${id}`,
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
        <div className="container" style={{ marginTop: "70px" }}>
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
                            <form onSubmit={Cari}>
                                <div className="form-floating" style={{ width: "100%", display: "inline-block" }}>
                                    <input name="tahun" type="text" className="form-control" id="floatingInput"
                                        placeholder="Tahun" value={tahun} onChange={e => changeHandlerSingle(e)} />
                                    <label htmlFor="floatingInput">Tahun</label>
                                </div>
                                <div className="mt-3 mb-3">
                                    <button type="submit" className="btn btn-outline-success"><HiSaveAs /> Cari</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <br></br>
            <div className="col-md-12">
            <Link to={`/rl310/tambah/`} className='btn btn-info' style={{fontSize:"18px", backgroundColor: "#779D9E", color: "#FFFFFF"}}>
                {/* <AiFillFileAdd size={30} style={{ color: "gray", cursor: "pointer" }} /> */}
                +
            </Link>
            <span style={{ color: "gray" }}>RL 3.10 Pelayanan Khusus</span>
            </div>
            

            <div className="row mt-3 mb-3">
                <div className="col-md-12">
                    <table className={style.rlTable}>
                        <thead>
                            <tr>
                                <th style={{ "width": "4%" }}>No Kegiatan</th>
                                <th>Aksi</th>
                                <th style={{ "width": "50%" }}>Jenis Kegiatan</th>
                                <th>Jumlah</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataRL.map((value, index) => {
                                return (
                                    <tr key={value.id}>
                                        <td>
                                            <input type="text" name="no" className="form-control" value={value.jenis_kegiatan.no} disabled={true} />
                                        </td>
                                        <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                                            <ToastContainer />
                                            {/* <RiDeleteBin5Fill size={20} onClick={(e) => hapus(value.id)} style={{ color: "gray", cursor: "pointer", marginRight: "5px" }} /> */}
                                            <button className="btn btn-danger" style={{margin: "0 5px 0 0", backgroundColor: "#FF6663", border: "1px solid #FF6663"}} type='button' onClick={(e) => hapus(value.id)}>H</button>
                                            <Link to={`/rl310/edit/${value.id}`} className='btn btn-warning' style={{margin: "0 5px 0 0", backgroundColor: "#CFD35E", border: "1px solid #CFD35E", color:"#FFFFFF"}}>
                                                U
                                                {/* <RiEdit2Fill size={20} style={{ color: "gray", cursor: "pointer" }} /> */}
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
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="container" style={{ textAlign: "center" }}>
                {spinner && <Spinner animation="grow" variant="success"></Spinner>}
                {spinner && <Spinner animation="grow" variant="success"></Spinner>}
                {spinner && <Spinner animation="grow" variant="success"></Spinner>}
                {spinner && <Spinner animation="grow" variant="success"></Spinner>}
                {spinner && <Spinner animation="grow" variant="success"></Spinner>}
                {spinner && <Spinner animation="grow" variant="success"></Spinner>}
            </div>
        </div>
    )
}

export default RL310