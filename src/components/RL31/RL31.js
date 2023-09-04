import React, { useState, useEffect } from 'react'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { useNavigate, Link } from 'react-router-dom'
import style from './FormTambahRL31.module.css'
import { HiSaveAs } from 'react-icons/hi'
import { RiDeleteBin5Fill, RiEdit2Fill } from 'react-icons/ri'
import { AiFillFileAdd } from 'react-icons/ai'
import { confirmAlert } from 'react-confirm-alert'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import 'react-confirm-alert/src/react-confirm-alert.css'
import Table from 'react-bootstrap/Table'

const RL31 = () => {
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
            getDataRLTigaTitikSatu(results)
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
                console.log('hello2')
            }
        }
    }

    const getDataRLTigaTitikSatu = async (event) => {
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
            const results = await axiosJWT.get('/apisirs/rltigatitiksatu',
                customConfig)

            const rlTigaTitikSatuDetails = results.data.data.map((value) => {
                return value.rl_tiga_titik_satu_details
            })

            let dataRLTigaTitikSatuDetails = []
            rlTigaTitikSatuDetails.forEach(element => {
                element.forEach(value => {
                    dataRLTigaTitikSatuDetails.push(value)
                })
            })
            setDataRL(dataRLTigaTitikSatuDetails)
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
            const results = await axiosJWT.get('/apisirs/rltigatitiksatu',
                customConfig)

            const rlTigaTitikSatuDetails = results.data.data.map((value) => {
                return value.rl_tiga_titik_satu_details
            })

            let dataRLTigaTitikSatuDetails = []
            rlTigaTitikSatuDetails.forEach(element => {
                element.forEach(value => {
                    dataRLTigaTitikSatuDetails.push(value)
                })
            })

            setDataRL(dataRLTigaTitikSatuDetails)
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
            await axiosJWT.delete(`/apisirs/rltigatitiksatu/${id}`,
                customConfig)
            toast('Data Berhasil Dihapus', {
                position: toast.POSITION.TOP_RIGHT
            })
            setDataRL((current) =>
                current.filter((value) => value.id !== id)
            )
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
                        <Link to={`/rl31/tambah/`} className='btn btn-info' style={{fontSize:"18px", backgroundColor: "#779D9E", color: "#FFFFFF"}}>
                            {/* <AiFillFileAdd size={30} style={{color:"gray",cursor: "pointer"}}/>
                                <span style={{color: "gray"}}>Tambah RL 3.1 Rawat Inap</span> */}
                            +
                        </Link>
                        <span style={{color: "gray"}}>RL. 3.1 Rawat Inap</span>
                        <Table 
                            className={style.rlTable}
                            striped
                            bordered
                            responsive
                            style={{ width: "200%" }}
                        >
                            <thead>
                                <tr>
                                    <th rowSpan="2" style={{"width": "2%"}}>No.</th>
                                    <th rowSpan="2" style={{"width": "2%"}}></th>
                                    <th rowSpan="2" style={{"width": "10%"}}>Jenis Pelayanan</th>
                                    <th rowSpan="2" style={{"width": "5%"}}>Pasien Awal Tahun</th>
                                    <th rowSpan="2" style={{"width": "5%"}}>Pasien Masuk</th>
                                    <th rowSpan="2" style={{"width": "5%"}}>Pasien Keluar Hidup</th>
                                    <th colSpan="2" style={{"width": "5%"}}>Pasien Keluar Mati</th>
                                    <th rowSpan="2" style={{"width": "5%"}}>Jumlah Lama Dirawat</th>
                                    <th rowSpan="2" style={{"width": "5%"}}>Pasien Akhir Tahun</th>
                                    <th rowSpan="2" style={{"width": "5%"}}>Jumlah Hari Perawatan</th>
                                    <th colSpan="6" style={{"width": "5%"}}>Rincian Hari Perawatan Per Kelas</th>
                                </tr>
                                <tr>
                                    <th style={{"width": "5%"}}>{"< 48 jam"}</th>
                                    <th style={{"width": "5%"}}>{">= 48 jam"}</th>
                                    <th style={{"width": "5%"}}>VVIP</th>
                                    <th style={{"width": "5%"}}>VIP</th>
                                    <th style={{"width": "5%"}}>1</th>
                                    <th style={{"width": "5%"}}>2</th>
                                    <th style={{"width": "5%"}}>3</th>
                                    <th style={{"width": "5%"}}>Khusus</th>
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
                                                <div style={{display: "flex"}}>
                                                    <button className="btn btn-danger" style={{margin: "0 5px 0 0", backgroundColor: "#FF6663", border: "1px solid #FF6663"}} type='button' onClick={(e) => hapus(value.id)}>H</button>
                                                    <Link to={`/rl31/ubah/${value.id}`} className='btn btn-warning' style={{margin: "0 5px 0 0", backgroundColor: "#CFD35E", border: "1px solid #CFD35E", color:"#FFFFFF"}} >
                                                        U
                                                    </Link>
                                                </div>
                                            </td>
                                            <td>
                                                <input type="text" name="jenisPelayanan" className="form-control" value={value.jenis_pelayanan.nama} disabled={true} />
                                            </td>
                                            <td>
                                                <input type="text" name="jumlahPasienAwalTahun" className="form-control" value={value.jumlah_pasien_awal_tahun} 
                                                onChange={e => changeHandler(e, index)} disabled={true} />
                                            </td>
                                            <td><input type="text" name="jumlahPasienMasuk" className="form-control" value={value.jumlah_pasien_masuk} 
                                                onChange={e => changeHandler(e, index)} disabled={true} />
                                            </td>
                                            <td><input type="text" name="jumlahPasienKeluarHidup" className="form-control" value={value.pasien_keluar_hidup} 
                                                onChange={e => changeHandler(e, index)} disabled={true} />
                                            </td>
                                            <td><input type="text" name="kurangDari48Jam" className="form-control" value={value.kurang_dari_48_Jam} 
                                                onChange={e => changeHandler(e, index)} disabled={true} />
                                            </td>
                                            <td><input type="text" name="lebihDariAtauSamaDengan48Jam" className="form-control" value={value.lebih_dari_atau_sama_dengan_48_jam} 
                                                onChange={e => changeHandler(e, index)} disabled={true} />
                                            </td>
                                            <td><input type="text" name="jumlahLamaDirawat" className="form-control" value={value.jumlah_lama_dirawat} 
                                                onChange={e => changeHandler(e, index)} disabled={true} />
                                            </td>
                                            <td><input type="text" name="jumlahPasienAkhirTahun" className="form-control" value={value.jumlah_pasien_akhir_tahun} 
                                                onChange={e => changeHandler(e, index)} disabled={true} />
                                            </td>
                                            <td><input type="text" name="jumlahHariPerawatan" className="form-control" value={value.jumlah_hari_perawatan} 
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

export default RL31