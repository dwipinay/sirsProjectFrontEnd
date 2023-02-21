import React, { useState, useEffect } from 'react'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { useNavigate, Link } from 'react-router-dom'
import style from './FormTambahRL31.module.css'
import { HiSaveAs } from 'react-icons/hi'
import { IoArrowBack } from 'react-icons/io5'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Table from 'react-bootstrap/Table'

const FormTambahRL31 = () => {
    const [tahun, setTahun] = useState('')
    const [namaRS, setNamaRS] = useState('')
    const [alamatRS, setAlamatRS] = useState('')
    const [namaPropinsi, setNamaPropinsi] = useState('')
    const [namaKabKota, setNamaKabKota] = useState('')
    const [dataRL, setDataRL] = useState([])
    const [token, setToken] = useState('')
    const [expire, setExpire] = useState('')
    const [buttonStatus, setButtonStatus] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        refreshToken()
        getRLTigaTitikSatuTemplate()
        const date = new Date();
        setTahun(date.getFullYear() - 1)
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

    const getRLTigaTitikSatuTemplate = async() => {
        try {
            const response = await axiosJWT.get('/apisirs/jenispelayanan?rlid=1', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            
            const rlTemplate = response.data.data.map((value, index) => {
                return {
                    id: value.id,
                    no: value.no,
                    jenisPelayanan: value.nama,
                    jumlahPasienAwalTahun: 0,
                    jumlahPasienMasuk: 0,
                    jumlahPasienKeluarHidup: 0,
                    kurangDari48Jam: 0,
                    lebihDariAtauSamaDengan48Jam: 0,
                    jumlahLamaDirawat: 0,
                    jumlahPasienAkhirTahun: 0,
                    jumlahHariPerawatan: 0,
                    kelasVVIP: 0,
                    kelasVIP: 0,
                    kelas1: 0,
                    kelas2: 0,
                    kelas3: 0,
                    kelasKhusus: 0,
                    disabledInput: true,
                    checked: false
                }
            })
            setDataRL(rlTemplate)
        } catch (error) {
            console.log(error)
        }
    }

    const handleFocus = ((event) => {
        event.target.select()
    })

    const changeHandlerSingle = (event) => {
        setTahun(event.target.value)
    }

    const penjumlahanPasienAkhirTahun = ((index) => {
        let newDataRL = [...dataRL]
        newDataRL[index].jumlahPasienAkhirTahun = (parseInt(newDataRL[index].jumlahPasienAwalTahun) +
        parseInt(newDataRL[index].jumlahPasienMasuk)) -
        (parseInt(newDataRL[index].jumlahPasienKeluarHidup) +
            parseInt(newDataRL[index].kurangDari48Jam) +
            parseInt(newDataRL[index].lebihDariAtauSamaDengan48Jam)
        )
    })

    const penjumlahanHariPerawatan = ((index) => {
        let newDataRL = [...dataRL]
        newDataRL[index].jumlahHariPerawatan = 
            parseInt(newDataRL[index].kelasVVIP) + 
            parseInt(newDataRL[index].kelasVIP) +
            parseInt(newDataRL[index].kelas1) +
            parseInt(newDataRL[index].kelas2) +
            parseInt(newDataRL[index].kelas3) +
            parseInt(newDataRL[index].kelasKhusus)
    })

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
        } else if (name === 'jumlahPasienAwalTahun') {
            if (event.target.value === '') {
                event.target.value = 0
                event.target.select(event.target.value)
            }
            newDataRL[index].jumlahPasienAwalTahun = parseInt(event.target.value)
            penjumlahanPasienAkhirTahun(index)
        } else if (name === 'jumlahPasienMasuk') {
            if (event.target.value === '') {
                event.target.value = 0
                event.target.select(event.target.value)
            }
            newDataRL[index].jumlahPasienMasuk = event.target.value
            penjumlahanPasienAkhirTahun(index)
        } else if (name === 'jumlahPasienKeluarHidup') {
            if (event.target.value === '') {
                event.target.value = 0
                event.target.select(event.target.value)
            }
            newDataRL[index].jumlahPasienKeluarHidup = event.target.value
            penjumlahanPasienAkhirTahun(index)
        } else if (name === 'kurangDari48Jam') {
            if (event.target.value === '') {
                event.target.value = 0
                event.target.select(event.target.value)
            }
            newDataRL[index].kurangDari48Jam = event.target.value
            penjumlahanPasienAkhirTahun(index)
        } else if (name === 'lebihDariAtauSamaDengan48Jam') {
            if (event.target.value === '') {
                event.target.value = 0
                event.target.select(event.target.value)
            }
            newDataRL[index].lebihDariAtauSamaDengan48Jam = event.target.value
            penjumlahanPasienAkhirTahun(index)
        } else if (name === 'jumlahLamaDirawat') {
            if (event.target.value === '') {
                event.target.value = 0
                event.target.select(event.target.value)
            }
            newDataRL[index].jumlahLamaDirawat = event.target.value
        } else if (name === 'jumlahPasienAkhirTahun') {
            if (event.target.value === '') {
                event.target.value = 0
                event.target.select(event.target.value)
            }
            newDataRL[index].jumlahPasienAkhirTahun = event.target.value
        } else if (name === 'jumlahHariPerawatan') {
            if (event.target.value === '') {
                event.target.value = 0
                event.target.select(event.target.value)
            }
            newDataRL[index].jumlahHariPerawatan = event.target.value
        } else if (name === 'kelasVVIP') {
            if (event.target.value === '') {
                event.target.value = 0
                event.target.select(event.target.value)
            }
            newDataRL[index].kelasVVIP = event.target.value
            penjumlahanHariPerawatan(index)
        } else if (name === 'kelasVIP') {
            if (event.target.value === '') {
                event.target.value = 0
                event.target.select(event.target.value)
            }
            newDataRL[index].kelasVIP = event.target.value
            penjumlahanHariPerawatan(index)
        } else if (name === 'kelas1') {
            if (event.target.value === '') {
                event.target.value = 0
                event.target.select(event.target.value)
            }
            newDataRL[index].kelas1 = event.target.value
            penjumlahanHariPerawatan(index)
        } else if (name === 'kelas2') {
            if (event.target.value === '') {
                event.target.value = 0
                event.target.select(event.target.value)
            }
            newDataRL[index].kelas2 = event.target.value
            penjumlahanHariPerawatan(index)
        } else if (name === 'kelas3') {
            if (event.target.value === '') {
                event.target.value = 0
                event.target.select(event.target.value)
            }
            newDataRL[index].kelas3 = event.target.value
            penjumlahanHariPerawatan(index)
        } else if (name === 'kelasKhusus') {
            if (event.target.value === '') {
                event.target.value = 0
                event.target.select(event.target.value)
            }
            newDataRL[index].kelasKhusus = event.target.value
            penjumlahanHariPerawatan(index)
        }
        setDataRL(newDataRL)
    }

    const Simpan = async (e) => {
        e.preventDefault()
        setButtonStatus(true)
        try {
            const dataRLArray = dataRL.filter((value) => {
                return value.checked === true
            }).map((value, index) => {
                return {
                    "jenisPelayananId": value.id,
                    "jumlahPasienAwalTahun": value.jumlahPasienAwalTahun,
                    "jumlahPasienMasuk": value.jumlahPasienMasuk,
                    "pasienKeluarHidup": value.jumlahPasienKeluarHidup,
                    "kurangDari48Jam": value.kurangDari48Jam,
                    "lebihDariAtauSamaDengan48Jam": value.lebihDariAtauSamaDengan48Jam,
                    "jumlahLamaDirawat": value.jumlahLamaDirawat,
                    "jumlahPasienAkhirTahun": value.jumlahPasienAkhirTahun,
                    "jumlahHariPerawatan": value.jumlahHariPerawatan,
                    "kelasVVIP": value.kelasVVIP,
                    "kelasVIP": value.kelasVIP,
                    "kelas1": value.kelas1,
                    "kelas2": value.kelas2,
                    "kelas3": value.kelas3,
                    "kelasKhusus": value.kelasKhusus
                }
            })

            let errorJumlahPasienAkhirTahun = false
            dataRLArray.forEach((value) => {
                if (value.jumlahPasienAkhirTahun < 0) {
                    errorJumlahPasienAkhirTahun = true
                    return false
                }
                return true
            })
            
            if (errorJumlahPasienAkhirTahun === true) {
                toast(`jumlah pasien akhir tahun tidak boleh lebih kecil dari 0`, {
                    position: toast.POSITION.TOP_RIGHT
                })
                setButtonStatus(false)
                return
            }

            const customConfig = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }

            await axiosJWT.post('/apisirs/rltigatitiksatu',{
                tahun: parseInt(tahun),
                data: dataRLArray
            }, customConfig)
            
            
            toast('Data Berhasil Disimpan', {
                position: toast.POSITION.TOP_RIGHT
            })
            setTimeout(() => {
                navigate('/rl31')
            }, 1000);
        } catch (error) {
            toast(`Data tidak bisa disimpan karena ,${error.response.data.message}`, {
                position: toast.POSITION.TOP_RIGHT
            })
            setButtonStatus(false)
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
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title h5">Periode Laporan</h5>
                                <div className="form-floating" style={{width:"100%", display:"inline-block"}}>
                                    <input name="tahun" type="text" className="form-control" id="floatingInput" 
                                        placeholder="Tahun" value={tahun} onChange={e => changeHandlerSingle(e)} disabled={true}/>
                                    <label htmlFor="floatingInput">Tahun</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-md-12">
                        <Link to={`/rl31/`} style={{textDecoration: "none"}}>
                            <IoArrowBack size={30} style={{color:"gray",cursor: "pointer"}}/>
                            <span style={{color: "gray"}}>RL 3.1 Rawat Inap</span>
                        </Link>
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
                                    <th rowSpan="2" style={{"width": "1%"}}></th>
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
                                                <input type='text' name='id' className="form-control" value={value.no} disabled={true}/>
                                            </td>
                                            <td style={{textAlign: "center", verticalAlign: "middle"}}>
                                                <input type="checkbox" name='check' className="form-check-input" onChange={e => changeHandler(e, index)} checked={value.checked}/>
                                            </td>
                                            <td>
                                                <input type="text" name="jenisPelayanan" className="form-control" value={value.jenisPelayanan} disabled={true} />
                                            </td>
                                            <td>
                                                <input type="number" name="jumlahPasienAwalTahun" className="form-control" value={value.jumlahPasienAwalTahun} 
                                                onFocus={handleFocus} onChange={e => changeHandler(e, index)} disabled={value.disabledInput} min={0} onPaste={preventPasteNegative}
                                                onKeyPress={preventMinus}/>
                                            </td>
                                            <td><input type="number" name="jumlahPasienMasuk" className="form-control" value={value.jumlahPasienMasuk} 
                                                onFocus={handleFocus} onChange={e => changeHandler(e, index)} disabled={value.disabledInput} min={0} onPaste={preventPasteNegative}
                                                onKeyPress={preventMinus} />
                                            </td>
                                            <td><input type="number" name="jumlahPasienKeluarHidup" className="form-control" value={value.jumlahPasienKeluarHidup} 
                                                onFocus={handleFocus} onChange={e => changeHandler(e, index)} disabled={value.disabledInput} min={0} onPaste={preventPasteNegative}
                                                onKeyPress={preventMinus} />
                                            </td>
                                            <td><input type="number" name="kurangDari48Jam" className="form-control" value={value.kurangDari48Jam} 
                                                onFocus={handleFocus} onChange={e => changeHandler(e, index)} disabled={value.disabledInput} min={0} onPaste={preventPasteNegative}
                                                onKeyPress={preventMinus} />
                                            </td>
                                            <td><input type="number" name="lebihDariAtauSamaDengan48Jam" className="form-control" value={value.lebihDariAtauSamaDengan48Jam} 
                                                onFocus={handleFocus} onChange={e => changeHandler(e, index)} disabled={value.disabledInput} min={0} onPaste={preventPasteNegative}
                                                onKeyPress={preventMinus}/>
                                            </td>
                                            <td><input type="number" name="jumlahLamaDirawat" className="form-control" value={value.jumlahLamaDirawat} 
                                                onFocus={handleFocus} onChange={e => changeHandler(e, index)} disabled={value.disabledInput} min={0} onPaste={preventPasteNegative}
                                                onKeyPress={preventMinus}/>
                                            </td>
                                            <td><input type="number" name="jumlahPasienAkhirTahun" className="form-control" value={value.jumlahPasienAkhirTahun} 
                                                onFocus={handleFocus} onChange={e => changeHandler(e, index)} disabled={true} min={0} onPaste={preventPasteNegative}
                                                onKeyPress={preventMinus}/>
                                            </td>
                                            <td><input type="number" name="jumlahHariPerawatan" className="form-control" value={value.jumlahHariPerawatan} 
                                                onFocus={handleFocus} onChange={e => changeHandler(e, index)} disabled={true} min={0} onPaste={preventPasteNegative}
                                                onKeyPress={preventMinus}/>
                                            </td>
                                            <td><input type="number" name="kelasVVIP" className="form-control" value={value.kelasVVIP} 
                                                onFocus={handleFocus} onChange={e => changeHandler(e, index)} disabled={value.disabledInput} min={0} onPaste={preventPasteNegative}
                                                onKeyPress={preventMinus}/>
                                            </td>
                                            <td><input type="number" name="kelasVIP" className="form-control" value={value.kelasVIP} 
                                                onFocus={handleFocus} onChange={e => changeHandler(e, index)} disabled={value.disabledInput} min={0} onPaste={preventPasteNegative}
                                                onKeyPress={preventMinus}/>
                                            </td>
                                            <td><input type="number" name="kelas1" className="form-control" value={value.kelas1} 
                                                onFocus={handleFocus} onChange={e => changeHandler(e, index)} disabled={value.disabledInput} min={0} onPaste={preventPasteNegative}
                                                onKeyPress={preventMinus}/>
                                            </td>
                                            <td><input type="number" name="kelas2" className="form-control" value={value.kelas2} 
                                                onFocus={handleFocus} onChange={e => changeHandler(e, index)} disabled={value.disabledInput} min={0} onPaste={preventPasteNegative}
                                                onKeyPress={preventMinus}/>
                                            </td>
                                            <td><input type="number" name="kelas3" className="form-control" value={value.kelas3} 
                                                onFocus={handleFocus} onChange={e => changeHandler(e, index)} disabled={value.disabledInput} min={0} onPaste={preventPasteNegative}
                                                onKeyPress={preventMinus}/>
                                            </td>
                                            <td><input type="number" name="kelasKhusus" className="form-control" value={value.kelasKhusus} 
                                                onFocus={handleFocus} onChange={e => changeHandler(e, index)} disabled={value.disabledInput} min={0} onPaste={preventPasteNegative}
                                                onKeyPress={preventMinus}/>
                                            </td>
                                        </tr>
                                    )
                                }) }
                            </tbody>
                        </Table>
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

export default FormTambahRL31