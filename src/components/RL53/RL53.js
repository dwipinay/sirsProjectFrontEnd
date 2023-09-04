import React, { useState, useEffect } from "react";
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { useNavigate, Link } from 'react-router-dom'
import style from './FormTambahRL53.module.css'
import { HiSaveAs } from 'react-icons/hi'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { RiDeleteBin5Fill, RiEdit2Fill } from 'react-icons/ri'
import { AiFillFileAdd } from 'react-icons/ai'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'
import Table from 'react-bootstrap/Table';
import Spinner from "react-bootstrap/esm/Spinner";

export const RL53 = () => {
    const [tahun, setTahun] = useState('2022')
    const [bulan, setBulan] = useState('01')
    const [namaRS, setNamaRS] = useState('')
    const [alamatRS, setAlamatRS] = useState('')
    const [namaPropinsi, setNamaPropinsi] = useState('')
    const [namaKabKota, setNamaKabKota] = useState('')
    const [token, setToken] = useState('')
    const [expire, setExpire] = useState('')
    const [dataRL, setDataRL] = useState([]);
    const [spinner, setSpinner] = useState(false)
    const navigate = useNavigate()


    useEffect(() => {
        refreshToken()
        getCariTahun(2022)
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

    const changeHandlerSingle = (event) => {
        const name = event.target.name
        if (name === 'tahun') {
            setTahun(event.target.value)
        } else if (name === 'bulan') {
            setBulan(event.target.value)
        }
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
        } else if (name === 'kodeIcd10') {
            // console.log(event.target.value)
            newDataRL[index].kodeIcd10 = event.target.value
        } else if (name === 'deskripsi') {
            // console.log(event.target.value)
            newDataRL[index].deskripsi = event.target.value
        } else if (name === 'pasienKeluarHidupLK') {
            newDataRL[index].pasienKeluarHidupLK = event.target.value
        } else if (name === 'pasienKeluarHidupPR') {
            newDataRL[index].pasienKeluarHidupPR = event.target.value
            // } else if (name === 'jumlahKasusBaru') {
            //     newDataRL[index].jumlahKasusBaru = event.target.value
        } else if (name === 'pasienKeluarMatiLK') {
            newDataRL[index].pasienKeluarMatiLK = event.target.value
        } else if (name === 'pasienKeluarMatiPR') {
            newDataRL[index].pasienKeluarMatiPR = event.target.value
        } else if (name === 'totalALL') {
            newDataRL[index].totalALL = event.target.value
        }
        setDataRL(newDataRL)
    }

    const getCariTahun = async (tahun) => {
        let date = (tahun + '-' + bulan + '-01')
        setSpinner(true)
        try {
            const customConfig = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    tahun: date
                },
            };
            const results = await axiosJWT.get("/apisirs/rllimatitiktigadetail", customConfig);
            const rlLimaTitikTigaDetails = results.data.data.map((value) => {
                return value;
            });

            setDataRL(rlLimaTitikTigaDetails);
            setSpinner(false)
        } catch (error) {
            console.log(error);
        }
    };

    const Cari = async (e) => {
        e.preventDefault()
        let date = (tahun + '-' + bulan + '-01')
        setSpinner(true)
        try {
            const customConfig = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    tahun: date
                },
            };
            const results = await axiosJWT.get("/apisirs/rllimatitiktigadetail", customConfig);
            const rlLimaTitikTigaDetails = results.data.data.map((value) => {
                return value;
            });

            setDataRL(rlLimaTitikTigaDetails);
            setSpinner(false)
        } catch (error) {
            console.log(error);
        }
    }
    const deleteUser = async (id) => {

        const customConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
        try {
            await axiosJWT.delete(`/apisirs/rllimatitiktigadetail/${id}`,
                customConfig)
            setDataRL((current) =>
                current.filter((value) => value.id !== id)
            )
            toast('Data Berhasil Dihapus', {
                position: toast.POSITION.TOP_RIGHT
            })
        } catch (error) {
            console.log(error)
            toast('Data Gagal Dihapus', {
                position: toast.POSITION.TOP_RIGHT
            })
        }
    }

    const hapus = (id) => {
        confirmAlert({
            title: 'Konfirmasi Penghapusan',
            message: 'Apakah Anda Yakin?',
            buttons: [
                {
                    label: 'Ya',
                    onClick: () => {
                        deleteUser(id)
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
                                    <select name="tahun" className="form-control" id="tahun" onChange={e => changeHandlerSingle(e)}>
                                        <option value="2022">2022</option>
                                        <option value="2023">2023</option>
                                    </select>
                                    <label htmlFor="tahun">Tahun</label>
                                </div>
                                <div className="form-floating" style={{ width: "100%", display: "inline-block" }}>
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
                                    <button type="submit" className="btn btn-outline-success"><HiSaveAs /> Cari</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row mt-3 mb-3">
                <div className="col-md-12">
                    {dataRL.length < 10 && (
                        <Link to={`/rl53/tambah/`} className='btn btn-info' style={{fontSize:"18px", backgroundColor: "#779D9E", color: "#FFFFFF"}}>
                            {/* <AiFillFileAdd size={30} style={{ color: "gray", cursor: "pointer" }} /><span style={{ color: "gray" }}></span> */}
                            +
                    <span style={{color: "white"}}> RL 5.3 10 Besar Penyakit Rawat Inap</span>
                            
                        </Link>
                        

                    )
                    }
                    <Table className={style.rlTable}>
                        <thead>
                            <tr>
                                <th>No. Urut</th>
                                <th> </th>
                                <th>KODE ICD 10</th>
                                <th>Deskripsi</th>
                                <th>Pasien Keluar Hidup Menur Jenis Kelamin LK</th>
                                <th>Pasien Keluar Hidup Menurut Jenis Kelamin PR</th>
                                <th>Pasien Keluar Mati Menurut Jenis Kelamin LK</th>
                                <th>Pasien Keluar Mati Menurut Jenis Kelamin PR</th>
                                <th>Total All</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataRL.map((value, index) => {
                                return (
                                    <tr key={value.id}>
                                        <td>
                                            <input type="text" name="no" className="form-control" value={index + 1} disabled={true} />
                                        </td>
                                        <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                                            <ToastContainer />
                                            <div style={{display: "flex"}}>
                                                    <button className="btn btn-danger" style={{margin: "0 5px 0 0", backgroundColor: "#FF6663", border: "1px solid #FF6663"}} type='button' onClick={(e) => hapus(value.id)}>H</button>
                                                    
                                            {/* <RiDeleteBin5Fill size={20} onClick={(e) => hapus(value.id)} style={{ color: "gray", cursor: "pointer", marginRight: "5px" }} /> */}
                                            <Link to={`/rl53/ubah/${value.id}`} className='btn btn-warning' style={{margin: "0 5px 0 0", backgroundColor: "#CFD35E", border: "1px solid #CFD35E", color:"#FFFFFF"}}>
                                                U
                                                {/* <RiEdit2Fill size={20} style={{ color: "gray", cursor: "pointer" }} /> */}
                                            </Link>
                                            </div>
                                        </td>
                                        <td><input type="text" name="kode_icd_10" className="form-control" value={value.kode_icd_10}
                                            onChange={e => changeHandler(e, index)} disabled={true} />
                                        </td>
                                        <td>{value.deskripsi}
                                            {/* <input type="text" name="deskripsi" className="form-control" value={value.deskripsi} 
                                    onChange={e => changeHandler(e, index)} disabled={true} /> */}
                                        </td>
                                        <td><input type="text" name="" className="form-control" value={value.pasien_keluar_hidup_menurut_jeniskelamin_lk}
                                            onChange={e => changeHandler(e, index)} disabled={true} />
                                        </td>
                                        <td><input type="text" name="" className="form-control" value={value.pasien_keluar_hidup_menurut_jeniskelamin_pr}
                                            onChange={e => changeHandler(e, index)} disabled={true} />
                                        </td>
                                        <td><input type="text" name="" className="form-control" value={value.pasien_keluar_mati_menurut_jeniskelamin_lk}
                                            onChange={e => changeHandler(e, index)} disabled={true} />
                                        </td>
                                        <td><input type="text" name="" className="form-control" value={value.pasien_keluar_mati_menurut_jeniskelamin_pr}
                                            onChange={e => changeHandler(e, index)} disabled={true} />
                                        </td>
                                        <td><input type="text" name="" className="form-control" value={value.pasien_keluar_hidup_menurut_jeniskelamin_lk + value.pasien_keluar_hidup_menurut_jeniskelamin_pr + value.pasien_keluar_mati_menurut_jeniskelamin_lk + value.pasien_keluar_mati_menurut_jeniskelamin_pr}
                                            onChange={e => changeHandler(e, index)} disabled={true} />
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
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

export default RL53