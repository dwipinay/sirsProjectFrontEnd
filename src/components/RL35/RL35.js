import React, { useState, useEffect } from 'react'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { useNavigate, Link } from 'react-router-dom'
import style from './FormTambahRL35.module.css'
import { HiSaveAs } from 'react-icons/hi'
import { RiDeleteBin5Fill, RiEdit2Fill } from 'react-icons/ri'
import { AiFillFileAdd } from 'react-icons/ai'
import { confirmAlert } from 'react-confirm-alert'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import 'react-confirm-alert/src/react-confirm-alert.css'
import Table from "react-bootstrap/Table";
import Spinner from 'react-bootstrap/Spinner'

const RL35 = () => {
    const [tahun, setTahun] = useState('')
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
        const getLastYear = async () =>{
            const date = new Date()
            setTahun(date.getFullYear() - 1)
            return date.getFullYear() - 1
        }
        getLastYear().then((results) => {
            getDataRLTigaTitikLima(results)
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

    const getDataRLTigaTitikLima = async (event) => {
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
            const results = await axiosJWT.get('/apisirs/rltigatitiklima',
                customConfig)

            const rlTigaTitikLimaDetails = results.data.data.map((value) => {
                return value.rl_tiga_titik_lima_details
            })

            let dataRLTigaTitikLimaDetails = []
            rlTigaTitikLimaDetails.forEach(element => {
                element.forEach(value => {
                    dataRLTigaTitikLimaDetails.push(value)
                })
            })
            // setDataRL(dataRLTigaTitikLimaDetails)

            let sortedProducts = dataRLTigaTitikLimaDetails.sort((p1, p2) =>
                        p1.jenis_kegiatan_id > p2.jenis_kegiatan_id
                    ? 1
                    : p1.jenis_kegiatan_id < p2.jenis_kegiatan_id
                    ? -1
                    : 0
            )

            // console.log(sortedProducts)

            let groups = []

            sortedProducts.reduce(function (res, value) {
                if (!res[value.jenis_kegiatan.group_jenis_kegiatan_id]) {
                    res[value.jenis_kegiatan.group_jenis_kegiatan_id] = {
                    groupId: value.jenis_kegiatan.group_jenis_kegiatan_id,
                    groupNama:
                        value.jenis_kegiatan.group_jenis_kegiatan_header.nama,
                    groupNo:
                        value.jenis_kegiatan.group_jenis_kegiatan_header.no,
                    // jumlah: 0,
                    rmRumahSakit: 0,
                    rmBidan: 0,
                    rmPuskesmas: 0,
                    rmFaskesLainnya: 0,
                    rmMati: 0,
                    rmTotal: 0,
                    rnmMati: 0,
                    rnmTotal: 0,
                    nrMati: 0,
                    nrTotal: 0,
                    dirujuk: 0

                    };
                    groups.push(
                    res[value.jenis_kegiatan.group_jenis_kegiatan_id]
                    )
                }
                res[value.jenis_kegiatan.group_jenis_kegiatan_id].rmRumahSakit +=
                    value.rmRumahSakit
                res[value.jenis_kegiatan.group_jenis_kegiatan_id].rmBidan +=
                    value.rmBidan
                res[value.jenis_kegiatan.group_jenis_kegiatan_id].rmPuskesmas +=
                    value.rmPuskesmas
                res[value.jenis_kegiatan.group_jenis_kegiatan_id].rmFaskesLainnya +=
                    value.rmFaskesLainnya
                res[value.jenis_kegiatan.group_jenis_kegiatan_id].rmMati +=
                    value.rmMati
                res[value.jenis_kegiatan.group_jenis_kegiatan_id].rmTotal +=
                    value.rmTotal
                res[value.jenis_kegiatan.group_jenis_kegiatan_id].rnmMati +=
                    value.rnmMati
                res[value.jenis_kegiatan.group_jenis_kegiatan_id].rnmTotal +=
                    value.rnmTotal
                res[value.jenis_kegiatan.group_jenis_kegiatan_id].nrMati +=
                    value.nrMati
                res[value.jenis_kegiatan.group_jenis_kegiatan_id].nrTotal +=
                    value.nrTotal
                res[value.jenis_kegiatan.group_jenis_kegiatan_id].dirujuk +=
                    value.dirujuk
                return res;
            }, {})

            let data = []

            groups.forEach((element) => {
            if (element.groupId != null) {
                const filterData = sortedProducts.filter((value, index) => {
                return (
                    value.jenis_kegiatan.group_jenis_kegiatan_id ===
                    element.groupId
                );
                });
                data.push({
                groupId: element.groupId,
                groupNo: element.groupNo,
                groupNama: element.groupNama,
                details: filterData,
                // subTotal: element.jumlah,
                subTotalRmRumahSakit: element.rmRumahSakit,
                subTotalRmBidan: element.rmBidan,
                subTotalRmPuskesmas: element.rmPuskesmas,
                subTotalRmFaskesLainnya: element.rmFaskesLainnya,
                subTotalRmMati: element.rmMati,
                subTotalRmTotal: element.rmTotal,
                subTotalRnmMati: element.rnmMati,
                subTotalRnmTotal: element.rnmTotal,
                subTotalNrMati: element.nrMati,
                subTotalNrTotal: element.nrTotal,
                subTotalDirujuk: element.dirujuk
                })
            }
            })
            // console.log(data)
            setDataRL(data)

            setSpinner(false)
        } catch (error) {
            console.log(error)
            setSpinner(false)
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
        setSpinner(true)
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
            const results = await axiosJWT.get('/apisirs/rltigatitiklima',
                customConfig)

            const rlTigaTitikLimaDetails = results.data.data.map((value) => {
                return value.rl_tiga_titik_lima_details
            })

            let dataRLTigaTitikLimaDetails = []
            rlTigaTitikLimaDetails.forEach(element => {
                element.forEach(value => {
                    dataRLTigaTitikLimaDetails.push(value)
                })
            })
            // setDataRL(dataRLTigaTitikLimaDetails)

            let sortedProducts = dataRLTigaTitikLimaDetails.sort((p1, p2) =>
                        p1.jenis_kegiatan_id > p2.jenis_kegiatan_id
                    ? 1
                    : p1.jenis_kegiatan_id < p2.jenis_kegiatan_id
                    ? -1
                    : 0
            )

            // console.log(sortedProducts)

            let groups = []

            sortedProducts.reduce(function (res, value) {
                if (!res[value.jenis_kegiatan.group_jenis_kegiatan_id]) {
                    res[value.jenis_kegiatan.group_jenis_kegiatan_id] = {
                    groupId: value.jenis_kegiatan.group_jenis_kegiatan_id,
                    groupNama:
                        value.jenis_kegiatan.group_jenis_kegiatan_header.nama,
                    groupNo:
                        value.jenis_kegiatan.group_jenis_kegiatan_header.no,
                    // jumlah: 0,
                    rmRumahSakit: 0,
                    rmBidan: 0,
                    rmPuskesmas: 0,
                    rmFaskesLainnya: 0,
                    rmMati: 0,
                    rmTotal: 0,
                    rnmMati: 0,
                    rnmTotal: 0,
                    nrMati: 0,
                    nrTotal: 0,
                    dirujuk: 0

                    };
                    groups.push(
                    res[value.jenis_kegiatan.group_jenis_kegiatan_id]
                    )
                }
                res[value.jenis_kegiatan.group_jenis_kegiatan_id].rmRumahSakit +=
                    value.rmRumahSakit
                res[value.jenis_kegiatan.group_jenis_kegiatan_id].rmBidan +=
                    value.rmBidan
                res[value.jenis_kegiatan.group_jenis_kegiatan_id].rmPuskesmas +=
                    value.rmPuskesmas
                res[value.jenis_kegiatan.group_jenis_kegiatan_id].rmFaskesLainnya +=
                    value.rmFaskesLainnya
                res[value.jenis_kegiatan.group_jenis_kegiatan_id].rmMati +=
                    value.rmMati
                res[value.jenis_kegiatan.group_jenis_kegiatan_id].rmTotal +=
                    value.rmTotal
                res[value.jenis_kegiatan.group_jenis_kegiatan_id].rnmMati +=
                    value.rnmMati
                res[value.jenis_kegiatan.group_jenis_kegiatan_id].rnmTotal +=
                    value.rnmTotal
                res[value.jenis_kegiatan.group_jenis_kegiatan_id].nrMati +=
                    value.nrMati
                res[value.jenis_kegiatan.group_jenis_kegiatan_id].nrTotal +=
                    value.nrTotal
                res[value.jenis_kegiatan.group_jenis_kegiatan_id].dirujuk +=
                    value.dirujuk
                return res;
            }, {})

            let data = []

            groups.forEach((element) => {
            if (element.groupId != null) {
                const filterData = sortedProducts.filter((value, index) => {
                return (
                    value.jenis_kegiatan.group_jenis_kegiatan_id ===
                    element.groupId
                );
                });
                data.push({
                groupId: element.groupId,
                groupNo: element.groupNo,
                groupNama: element.groupNama,
                details: filterData,
                // subTotal: element.jumlah,
                subTotalRmRumahSakit: element.rmRumahSakit,
                subTotalRmBidan: element.rmBidan,
                subTotalRmPuskesmas: element.rmPuskesmas,
                subTotalRmFaskesLainnya: element.rmFaskesLainnya,
                subTotalRmMati: element.rmMati,
                subTotalRmTotal: element.rmTotal,
                subTotalRnmMati: element.rnmMati,
                subTotalRnmTotal: element.rnmTotal,
                subTotalNrMati: element.nrMati,
                subTotalNrTotal: element.nrTotal,
                subTotalDirujuk: element.dirujuk
                })
            }
            })
            // console.log(data)
            setDataRL(data)

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
            await axiosJWT.delete(`/apisirs/rltigatitiklima/${id}`,
                customConfig)
            setDataRL((current) =>
                current.filter((value) => value.id !== id)
            )

            // SET Data after delete
            
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
                const results = await axiosJWT.get('/apisirs/rltigatitiklima',
                    customConfig)
    
                const rlTigaTitikLimaDetails = results.data.data.map((value) => {
                    return value.rl_tiga_titik_lima_details
                })
    
                let dataRLTigaTitikLimaDetails = []
                rlTigaTitikLimaDetails.forEach(element => {
                    element.forEach(value => {
                        dataRLTigaTitikLimaDetails.push(value)
                    })
                })
    
                let sortedProducts = dataRLTigaTitikLimaDetails.sort((p1, p2) =>
                            p1.jenis_kegiatan_id > p2.jenis_kegiatan_id
                        ? 1
                        : p1.jenis_kegiatan_id < p2.jenis_kegiatan_id
                        ? -1
                        : 0
                )
    
                let groups = []
    
                sortedProducts.reduce(function (res, value) {
                    if (!res[value.jenis_kegiatan.group_jenis_kegiatan_id]) {
                        res[value.jenis_kegiatan.group_jenis_kegiatan_id] = {
                        groupId: value.jenis_kegiatan.group_jenis_kegiatan_id,
                        groupNama:
                            value.jenis_kegiatan.group_jenis_kegiatan_header.nama,
                        groupNo:
                            value.jenis_kegiatan.group_jenis_kegiatan_header.no,
                        rmRumahSakit: 0,
                        rmBidan: 0,
                        rmPuskesmas: 0,
                        rmFaskesLainnya: 0,
                        rmMati: 0,
                        rmTotal: 0,
                        rnmMati: 0,
                        rnmTotal: 0,
                        nrMati: 0,
                        nrTotal: 0,
                        dirujuk: 0
    
                        };
                        groups.push(
                        res[value.jenis_kegiatan.group_jenis_kegiatan_id]
                        )
                    }
                    res[value.jenis_kegiatan.group_jenis_kegiatan_id].rmRumahSakit +=
                        value.rmRumahSakit
                    res[value.jenis_kegiatan.group_jenis_kegiatan_id].rmBidan +=
                        value.rmBidan
                    res[value.jenis_kegiatan.group_jenis_kegiatan_id].rmPuskesmas +=
                        value.rmPuskesmas
                    res[value.jenis_kegiatan.group_jenis_kegiatan_id].rmFaskesLainnya +=
                        value.rmFaskesLainnya
                    res[value.jenis_kegiatan.group_jenis_kegiatan_id].rmMati +=
                        value.rmMati
                    res[value.jenis_kegiatan.group_jenis_kegiatan_id].rmTotal +=
                        value.rmTotal
                    res[value.jenis_kegiatan.group_jenis_kegiatan_id].rnmMati +=
                        value.rnmMati
                    res[value.jenis_kegiatan.group_jenis_kegiatan_id].rnmTotal +=
                        value.rnmTotal
                    res[value.jenis_kegiatan.group_jenis_kegiatan_id].nrMati +=
                        value.nrMati
                    res[value.jenis_kegiatan.group_jenis_kegiatan_id].nrTotal +=
                        value.nrTotal
                    res[value.jenis_kegiatan.group_jenis_kegiatan_id].dirujuk +=
                        value.dirujuk
                    return res;
                }, {})
    
                let data = []
    
                groups.forEach((element) => {
                if (element.groupId != null) {
                    const filterData = sortedProducts.filter((value, index) => {
                    return (
                        value.jenis_kegiatan.group_jenis_kegiatan_id ===
                        element.groupId
                    );
                    });
                    data.push({
                    groupId: element.groupId,
                    groupNo: element.groupNo,
                    groupNama: element.groupNama,
                    details: filterData,
                    subTotalRmRumahSakit: element.rmRumahSakit,
                    subTotalRmBidan: element.rmBidan,
                    subTotalRmPuskesmas: element.rmPuskesmas,
                    subTotalRmFaskesLainnya: element.rmFaskesLainnya,
                    subTotalRmMati: element.rmMati,
                    subTotalRmTotal: element.rmTotal,
                    subTotalRnmMati: element.rnmMati,
                    subTotalRnmTotal: element.rnmTotal,
                    subTotalNrMati: element.nrMati,
                    subTotalNrTotal: element.nrTotal,
                    subTotalDirujuk: element.dirujuk
                    })
                }
                })
                setDataRL(data)
            } catch (error) {
                console.log(error)
            }
            //

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
                                            placeholder="Tahun" value={tahun} onChange={e => changeHandlerSingle(e)}/>
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
                        <Link to={`/rl35/tambah/`} style={{textDecoration: "none"}}>
                            <AiFillFileAdd size={30} style={{color:"gray",cursor: "pointer"}}/>
                            <span style={{color:"gray"}}>RL 3.5 -  Perinatologi</span>
                        </Link>
                        <div className="container" style={{ textAlign: "center" }}>
                            {spinner && <Spinner animation="grow" variant="success"></Spinner>}
                            {spinner && <Spinner animation="grow" variant="success"></Spinner>}
                            {spinner && <Spinner animation="grow" variant="success"></Spinner>}
                            {spinner && <Spinner animation="grow" variant="success"></Spinner>}
                            {spinner && <Spinner animation="grow" variant="success"></Spinner>}
                            {spinner && <Spinner animation="grow" variant="success"></Spinner>}
                        </div>
                        <Table
                            className={style.rlTable}
                            striped
                            bordered
                            responsive
                            style={{ width: "200%" }}
                        >
                            <thead>
                                <tr>
                                    <th style={{"width": "2.5%"}}>No.</th>
                                    <th style={{"width": "2.5%"}}>Aksi</th>
                                    <th style={{"width": "10%"}}>Jenis Kegiatan</th>
                                    <th >Rujukan Medis Rumah Sakit</th>
                                    <th >Rujukan Medis Bidan</th>
                                    <th >Rujukan Medis Puskesmas</th>
                                    <th >Rujukan Medis Faskes Lainnya</th>
                                    <th >Rujukan Medis Mati</th>
                                    <th >Rujukan Medis Total</th>
                                    <th >Rujukan Non Medis Mati</th>
                                    <th >Rujukan Non Medis Total</th>
                                    <th >Non Rujukan Mati</th>
                                    <th >Non Rujukan Total</th>
                                    <th >Dirujuk</th>
                                </tr>
                            </thead>
                            <tbody>
                                
                                {
                                    //eslint-disable-next-line
                                    dataRL.map((value, index) => {
                                        if (value.groupNama != null) {
                                        return (
                                            <React.Fragment key={index}>
                                            <tr>
                                                <td>
                                                    {/* {value.groupNo} */}
                                                    <input type='text' name='id' className="form-control" value={value.groupNo} disabled={true}/>
                                                </td>
                                                <td></td>
                                                <td >
                                                {/* {value.groupNama} */}
                                                
                                                    <input type="text" name="jenisKegiatan" className="form-control" value={value.groupNama} disabled={true} />
                                                
                                                </td>
                                                {/* <td>{value.subTotalRmRumahSakit}</td>
                                                <td>{value.subTotalRmBidan}</td>
                                                <td>{value.subTotalRmPuskesmas}</td>
                                                <td>{value.subTotalRmFaskesLainnya}</td>
                                                <td>{value.subTotalRmMati}</td>
                                                <td>{value.subTotalRmTotal}</td>
                                                <td>{value.subTotalRnmMati}</td>
                                                <td>{value.subTotalRnmTotal}</td>
                                                <td>{value.subTotalNrMati}</td>
                                                <td>{value.subTotalNrTotal}</td>
                                                <td>{value.subTotalDirujuk}</td> */}

                                                <td><input type="text" name="rmRumahSakit" className="form-control" value={value.subTotalRmRumahSakit} 
                                                            onChange={e => changeHandler(e, index)} disabled={true} /></td>
                                                <td><input type="text" name="rmBidan" className="form-control" value={value.subTotalRmBidan} 
                                                            onChange={e => changeHandler(e, index)} disabled={true} /></td>
                                                <td><input type="text" name="rmPuskesmas" className="form-control" value={value.subTotalRmPuskesmas} 
                                                            onChange={e => changeHandler(e, index)} disabled={true} /></td>
                                                <td><input type="text" name="rmFaskesLainnya" className="form-control" value={value.subTotalRmFaskesLainnya} 
                                                            onChange={e => changeHandler(e, index)} disabled={true} /></td>
                                                <td><input type="text" name="rmMati" className="form-control" value={value.subTotalRmMati} 
                                                            onChange={e => changeHandler(e, index)} disabled={true} /></td>
                                                <td><input type="text" name="rmTotal" className="form-control" value={value.subTotalRmTotal} 
                                                            onChange={e => changeHandler(e, index)} disabled={true} /></td>
                                                <td><input type="text" name="rnmMati" className="form-control" value={value.subTotalRnmMati} 
                                                            onChange={e => changeHandler(e, index)} disabled={true} /></td>
                                                <td><input type="text" name="rnmTotal" className="form-control" value={value.subTotalRnmTotal} 
                                                            onChange={e => changeHandler(e, index)} disabled={true} /></td>
                                                <td><input type="text" name="nrMati" className="form-control" value={value.subTotalNrMati} 
                                                            onChange={e => changeHandler(e, index)} disabled={true} /></td>
                                                <td><input type="text" name="nrTotal" className="form-control" value={value.subTotalNrTotal} 
                                                            onChange={e => changeHandler(e, index)} disabled={true} /></td>
                                                <td><input type="text" name="dirujuk" className="form-control" value={value.subTotalDirujuk} 
                                                            onChange={e => changeHandler(e, index)} disabled={true} /></td>

                                            </tr>
                                            {value.details.map((value2, index2) => {
                                                return (
                                                <tr key={index2}>
                                                    <td>
                                                        <input type='text' name='id' className="form-control" value={value2.jenis_kegiatan.no} disabled={true}/>
                                                    </td>
                                                    <td>
                                                    <ToastContainer />
                                                    <RiDeleteBin5Fill
                                                        size={20}
                                                        onClick={(e) =>
                                                        hapus(value2.id, value2.tahun)
                                                        }
                                                        style={{
                                                        color: "gray",
                                                        cursor: "pointer",
                                                        marginRight: "5px",
                                                        }}
                                                    />
                                                    {value2.jenis_kegiatan.nama !== "Tidak Ada Data" &&
                                                    <Link to={`/rl35/ubah/${value2.id}`}>
                                                        <RiEdit2Fill
                                                        size={20}
                                                        style={{ color: "gray", cursor: "pointer" }}
                                                        />
                                                    </Link>
                                                    }
                                                    </td>
                                                    {/* <td style={{ textAlign: "left" }}>
                                                    &emsp;{value2.jenis_kegiatan.nama}
                                                    </td> */}
                                                    <td >
                                                        <input type="text" name="jenisKegiatan" className="form-control" value={value2.jenis_kegiatan.nama} disabled={true} />
                                                    </td>
                                                    {/* <td>{value2.rmRumahSakit}</td>
                                                    <td>{value2.rmBidan}</td>
                                                    <td>{value2.rmPuskesmas}</td>
                                                    <td>{value2.rmFaskesLainnya}</td>
                                                    <td>{value2.rmMati}</td>
                                                    <td>{value2.rmTotal}</td>
                                                    <td>{value2.rnmMati}</td>
                                                    <td>{value2.rnmTotal}</td>
                                                    <td>{value2.nrMati}</td>
                                                    <td>{value2.nrTotal}</td>
                                                    <td>{value2.dirujuk}</td> */}
                                                    <td><input type="text" name="rmRumahSakit" className="form-control" value={value2.rmRumahSakit} 
                                                            onChange={e => changeHandler(e, index)} disabled={true} /></td>
                                                    <td><input type="text" name="rmBidan" className="form-control" value={value2.rmBidan} 
                                                                onChange={e => changeHandler(e, index)} disabled={true} /></td>
                                                    <td><input type="text" name="rmPuskesmas" className="form-control" value={value2.rmPuskesmas} 
                                                                onChange={e => changeHandler(e, index)} disabled={true} /></td>
                                                    <td><input type="text" name="rmFaskesLainnya" className="form-control" value={value2.rmFaskesLainnya} 
                                                                onChange={e => changeHandler(e, index)} disabled={true} /></td>
                                                    <td><input type="text" name="rmMati" className="form-control" value={value2.rmMati} 
                                                                onChange={e => changeHandler(e, index)} disabled={true} /></td>
                                                    <td><input type="text" name="rmTotal" className="form-control" value={value2.rmTotal} 
                                                                onChange={e => changeHandler(e, index)} disabled={true} /></td>
                                                    <td><input type="text" name="rnmMati" className="form-control" value={value2.rnmMati} 
                                                                onChange={e => changeHandler(e, index)} disabled={true} /></td>
                                                    <td><input type="text" name="rnmTotal" className="form-control" value={value2.rnmTotal} 
                                                                onChange={e => changeHandler(e, index)} disabled={true} /></td>
                                                    <td><input type="text" name="nrMati" className="form-control" value={value2.nrMati} 
                                                                onChange={e => changeHandler(e, index)} disabled={true} /></td>
                                                    <td><input type="text" name="nrTotal" className="form-control" value={value2.nrTotal} 
                                                                onChange={e => changeHandler(e, index)} disabled={true} /></td>
                                                    <td><input type="text" name="dirujuk" className="form-control" value={value2.dirujuk} 
                                                                onChange={e => changeHandler(e, index)} disabled={true} /></td>
                                                </tr>
                                                );
                                            })}
                                            </React.Fragment>
                                        );
                                        } 
                                        // else if (value.groupNama == null) {
                                        // return (
                                        //     <React.Fragment key={index}>
                                        //     <tr>
                                        //         <td style={{ textAlign: "left" }}>
                                        //         {value.details[0].nama}
                                        //         </td>
                                        //         <td>{value.details[0].nilai}</td>
                                        //     </tr>
                                        //     </React.Fragment>
                                        // );
                                        // }
                                    })
                                    
                                }
                            </tbody>
                        </Table>
                    </div>
                </div>
        </div>
    )
    
}

export default RL35