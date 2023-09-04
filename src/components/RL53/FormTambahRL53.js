import React, { useState, useEffect } from 'react'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { useNavigate, Link } from 'react-router-dom'
import style from './FormTambahRL53.module.css'
import { HiSaveAs } from 'react-icons/hi'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoArrowBack } from 'react-icons/io5'
import { Typeahead } from 'react-bootstrap-typeahead';

const FormTambahRL53 = () => {
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
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        refreshToken()
        getRLLimaTitikEmpatTemplate()
        getIcd10()
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
            //    console.log(response.data)
            setNamaRS(response.data.data[0].nama)
            setAlamatRS(response.data.data[0].alamat)
            setNamaPropinsi(response.data.data[0].propinsi.nama)
            setNamaKabKota(response.data.data[0].kabKota.nama)
        } catch (error) {

        }
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

    const getRLLimaTitikEmpatTemplate = async () => {
        try {
            const response = await axiosJWT.get('/apisirs/getnourut', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const rlTemplate = response.data.data.map((value, index) => {
                return {
                    id: value.id,
                    no: value.no,
                    kodeIcd10: '',
                    deskripsi: '',
                    pasienKeluarHidupLK: 0,
                    pasienKeluarHidupPR: 0,
                    // jumlahKasusBaru: 0,
                    pasienKeluarMatiLK: 0,
                    pasienKeluarMatiPR: 0,
                    totalALL: 0,
                    disabledInput: true,
                    checked: false
                }
            })
            setDataRL(rlTemplate)
            //console.log(rlTemplate)
        } catch (error) {

        }
    }
    // console.log(dataRL);
    const changeHandlerSingle = (event) => {
        const name = event.target.name
        if (name === 'tahun') {
            setTahun(event.target.value)
        } else if (name === 'bulan') {
            setBulan(event.target.value)
        }
    }

    const handleChange = (event, index) => {
        let newDataRL = [...dataRL]
        if (typeof event[0] !== 'undefined') {
            newDataRL[index].kodeIcd10 = event[0].kodeIcd10
            newDataRL[index].deskripsi = event[0].deskripsi
            setDataRL(newDataRL)
        }
    }

    const changeHandler = (event, index) => {
        let newDataRL = [...dataRL]
        const name = event.target.name
        if (name === 'check') {
            if (event.target.checked === true) {
                newDataRL[index].disabledInput = false
                getIcd10()
            } else if (event.target.checked === false) {
                newDataRL[index].disabledInput = true
            }
            newDataRL[index].checked = event.target.checked
        } else if (name === 'no') {
            if (event.target.value === "") {
                event.target.value = 0
                event.target.select(event.target.value)
            }
            newDataRL[index].no = event.target.value
        } else if (name === 'kodeIcd10') {
            if (event.target.value === "") {
                event.target.value = 0
                event.target.select(event.target.value)
            }
            newDataRL[index].kodeIcd10 = event.target.value
        } else if (name === 'deskripsi') {
            if (event.target.value === "") {
                event.target.value = 0
                event.target.select(event.target.value)
            }
            newDataRL[index].deskripsi = event.target.value
        } else if (name === 'pasienKeluarHidupLK') {
            if (event.target.value === "") {
                event.target.value = 0
                event.target.select(event.target.value)
            }
            newDataRL[index].pasienKeluarHidupLK = event.target.value
        } else if (name === 'pasienKeluarHidupPR') {
            if (event.target.value === "") {
                event.target.value = 0
                event.target.select(event.target.value)
            }
            newDataRL[index].pasienKeluarHidupPR = event.target.value
        } else if (name === 'pasienKeluarMatiLK') {
            if (event.target.value === "") {
                event.target.value = 0
                event.target.select(event.target.value)
            }
            newDataRL[index].pasienKeluarMatiLK = event.target.value
        } else if (name === 'pasienKeluarMatiPR') {
            if (event.target.value === "") {
                event.target.value = 0
                event.target.select(event.target.value)
            }
            newDataRL[index].pasienKeluarMatiPR = event.target.value
        } else if (name === 'totalALL') {
            if (event.target.value === "") {
                event.target.value = 0
                event.target.select(event.target.value)
            }
            newDataRL[index].totalALL = event.target.value
        }
        setDataRL(newDataRL)
    }

    const handleFocus = ((event) => {
        event.target.select()
    })

    const Simpan = async (e) => {
        let date = (tahun + '-' + bulan + '-01');
        e.preventDefault()
        try {

            const dataRLArray = dataRL.filter((value) => {
                return value.checked === true
            }).map((value, index) => {
                return {

                    "noUrutId": value.id,
                    "kodeIcd10": value.kodeIcd10,
                    "deskripsi": value.deskripsi,
                    "pasienKeluarHidupLK": value.pasienKeluarHidupLK,
                    "pasienKeluarHidupPR": value.pasienKeluarHidupPR,
                    "pasienKeluarMatiLK": value.pasienKeluarMatiLK,
                    "pasienKeluarMatiPR": value.pasienKeluarMatiPR
                }
            })

            const customConfig = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
            await axiosJWT.post('/apisirs/rllimatitiktiga', {
                tahun: parseInt(tahun),
                tahunDanBulan: date,
                data: dataRLArray
            }, customConfig)
            toast('Data Berhasil Disimpan', {
                position: toast.POSITION.TOP_RIGHT
            })
            setTimeout(() => {
                navigate('/rl53')
            }, 1000);
        } catch (error) {
            toast(`Data tidak bisa disimpan karena ,${error.response.data.message}`, {
                position: toast.POSITION.TOP_RIGHT
            })
        }
    }

    return (
        <div className="container" style={{ marginTop: "70px" }}>
            <form onSubmit={Simpan}>
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
                        <table className={style.rlTable}>
                            <thead>
                                <tr>
                                    <th style={{ "width": "6%" }}>No.</th>
                                    <th style={{ "width": "2%" }}></th>
                                    <th style={{ "width": "6%" }}>No Urut</th>
                                    <th>KODE ICD 10</th>
                                    <th>Pasien Keluar Hidup Menur Jenis Kelamin LK</th>
                                    <th>Pasien Keluar Hidup Menurut Jenis Kelamin PR</th>
                                    <th>Pasien Keluar Mati Menurut Jenis Kelamin LK</th>
                                    <th>Pasien Keluar Mati Menurut Jenis Kelamin PR</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataRL.map((value, index) => {
                                    return (
                                        <tr key={value.id}>
                                            <td>
                                                {value.id}
                                            </td>
                                            <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                                                <input type="checkbox" name='check' className="form-check-input" onChange={e => changeHandler(e, index)} checked={value.checked} />
                                            </td>
                                            <td>
                                                <input type="text" name="no" className="form-control" value={value.no} disabled={true} />
                                            </td>
                                            <td>
                                                {/* <input type="hidden" name="kodeIcd10" className="form-control" value={selected[0]} */}
                                                {/* /> */}
                                                <Typeahead
                                                    id="kodeIcd10"
                                                    labelKey="kodeIcd10"
                                                    nameClass="kodeIcd10"
                                                    onChange={e => handleChange(e, index)}
                                                    options={selected}
                                                    placeholder="Choose a state..."
                                                    selected={value.selected}
                                                    disabled={value.disabledInput}
                                                />
                                            </td>
                                            <td><input type="number" min={0} name="pasienKeluarHidupLK" className="form-control" value={value.pasienKeluarHidupLK}
                                                onChange={e => changeHandler(e, index)} disabled={value.disabledInput} onFocus={handleFocus} />
                                            </td>
                                            <td><input type="number" min={0} name="pasienKeluarHidupPR" className="form-control" value={value.pasienKeluarHidupPR}
                                                onChange={e => changeHandler(e, index)} disabled={value.disabledInput} onFocus={handleFocus} />
                                            </td>
                                            <td><input type="number" min={0} name="pasienKeluarMatiLK" className="form-control" value={value.pasienKeluarMatiLK}
                                                onChange={e => changeHandler(e, index)} disabled={value.disabledInput} onFocus={handleFocus} />
                                            </td>
                                            <td><input type="number" min={0} name="pasienKeluarMatiPR" className="form-control" value={value.pasienKeluarMatiPR}
                                                onChange={e => changeHandler(e, index)} disabled={value.disabledInput} onFocus={handleFocus} />
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="mt-3 mb-3">
                    <ToastContainer />
                    <button type="submit" className="btn btn-outline-success"><HiSaveAs /> Simpan</button>
                </div>
            </form>
        </div>

    )
}

export default FormTambahRL53