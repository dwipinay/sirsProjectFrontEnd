import React, { useState, useEffect } from 'react'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { useNavigate, useParams, Link } from 'react-router-dom'
import style from './FormTambahRL31.module.css'
import { HiSaveAs } from 'react-icons/hi'
import { IoArrowBack } from 'react-icons/io5'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Table from 'react-bootstrap/Table'

const FormUbahRL31 = () => {
    const [namaRS, setNamaRS] = useState('')
    const [alamatRS, setAlamatRS] = useState('')
    const [namaPropinsi, setNamaPropinsi] = useState('')
    const [namaKabKota, setNamaKabKota] = useState('')
    const [jenisPelayanan, setJenisPelayanan] = useState(0)
    const [jumlahPasienAwalTahun, setJumlahPasienAwalTahun] = useState(0)
    const [jumlahPasienMasuk, setJumlahPasienMasuk] = useState(0)
    const [jumlahPasienKeluarHidup, setJumlahPasienKeluarHidup] = useState(0)
    const [kurangDari48Jam, setKurangDari48Jam] = useState(0)
    const [lebihDariAtauSamaDengan48Jam, setLebihDariAtauSamaDengan48Jam] = useState(0)
    const [jumlahLamaDirawat, setJumlahLamaDirawat] = useState(0)
    const [jumlahPasienAkhirTahun, setJumlahPasienAkhirTahun] = useState(0)
    const [jumlahHariPerawatan, setJumlahHariPerawatan] = useState(0)
    const [kelasVVIP, setKelasVVIP] = useState(0)
    const [kelasVIP, setKelasVIP] = useState(0)
    const [kelas1, setKelas1] = useState(0)
    const [kelas2, setKelas2] = useState(0)
    const [kelas3, setKelas3] = useState(0)
    const [kelasKhusus, setKelasKhusus] = useState(0)
    const [token, setToken] = useState(0)
    const [expire, setExpire] = useState(0)
    const navigate = useNavigate()
    const { id } = useParams();
    const [buttonStatus, setButtonStatus] = useState(false)

    useEffect(() => {
        refreshToken()
        getDataRLTigaTitikSatuDetailById(id)
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
            console.log(error)
        }
    }

    const getDataRLTigaTitikSatuDetailById = async (id) => {
        try {
            const response = await axiosJWT.get('/apisirs/rltigatitiksatudetail/' + id, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(response.data.data)
            setJenisPelayanan(response.data.data.jenis_pelayanan.nama)
            setJumlahPasienAwalTahun(response.data.data.jumlah_pasien_awal_tahun)
            setJumlahPasienMasuk(response.data.data.jumlah_pasien_masuk)
            setJumlahPasienKeluarHidup(response.data.data.pasien_keluar_hidup)
            setKurangDari48Jam(response.data.data.kurang_dari_48_Jam)
            setLebihDariAtauSamaDengan48Jam(response.data.data.lebih_dari_atau_sama_dengan_48_jam)
            setJumlahLamaDirawat(response.data.data.jumlah_lama_dirawat                )
            setJumlahPasienAkhirTahun(response.data.data.jumlah_pasien_akhir_tahun)
            setJumlahHariPerawatan(response.data.data.jumlah_hari_perawatan)
            setKelasVVIP(response.data.data.kelas_VVIP)
            setKelasVIP(response.data.data.kelas_VIP)
            setKelas1(response.data.data.kelas_1)
            setKelas2(response.data.data.kelas_2)
            setKelas3(response.data.data.kelas_3)
            setKelasKhusus(response.data.data.kelas_khusus)
        } catch (error) {
            console.log(error)
        }
    }

    const handleFocus = ((event) => {
        event.target.select()
    })

    const changeHandler = (event, index) => {
        const targetName = event.target.name
        switch (targetName) {
            case "jumlahPasienAwalTahun":
                if (event.target.value === '') {
                    event.target.value = 0
                    event.target.select(event.target.value)
                }
                setJumlahPasienAwalTahun(event.target.value)
                setJumlahPasienAkhirTahun(
                    (
                        parseInt(event.target.value) +
                        parseInt(jumlahPasienMasuk)
                    ) - 
                    (
                        parseInt(jumlahPasienKeluarHidup) +
                        parseInt(kurangDari48Jam) +
                        parseInt(lebihDariAtauSamaDengan48Jam)
                    )
                )
                break
            case "jumlahPasienMasuk":
                if (event.target.value === '') {
                    event.target.value = 0
                    event.target.select(event.target.value)
                }
                setJumlahPasienMasuk(event.target.value)
                setJumlahPasienAkhirTahun(
                    (
                        parseInt(event.target.value) +
                        parseInt(jumlahPasienAwalTahun)
                    ) - 
                    (
                        parseInt(jumlahPasienKeluarHidup) +
                        parseInt(kurangDari48Jam) +
                        parseInt(lebihDariAtauSamaDengan48Jam)
                    )
                )
                break
            case "jumlahPasienKeluarHidup":
                if (event.target.value === '') {
                    event.target.value = 0
                    event.target.select(event.target.value)
                }
                setJumlahPasienKeluarHidup(event.target.value)
                setJumlahPasienAkhirTahun(
                    (
                        parseInt(jumlahPasienAwalTahun) +
                        parseInt(jumlahPasienMasuk)
                    ) - 
                    (
                        parseInt(event.target.value) +
                        parseInt(kurangDari48Jam) +
                        parseInt(lebihDariAtauSamaDengan48Jam)
                    )
                )
                break
            case "kurangDari48Jam":
                if (event.target.value === '') {
                    event.target.value = 0
                    event.target.select(event.target.value)
                }
                setKurangDari48Jam(event.target.value)
                setJumlahPasienAkhirTahun(
                    (
                        parseInt(jumlahPasienAwalTahun) +
                        parseInt(jumlahPasienMasuk)
                    ) - 
                    (
                        parseInt(jumlahPasienKeluarHidup) +
                        parseInt(event.target.value) +
                        parseInt(lebihDariAtauSamaDengan48Jam)
                    )
                )
                break
            case "lebihDariAtauSamaDengan48Jam":
                if (event.target.value === '') {
                    event.target.value = 0
                    event.target.select(event.target.value)
                }
                setLebihDariAtauSamaDengan48Jam(event.target.value)
                setJumlahPasienAkhirTahun(
                    (
                        parseInt(jumlahPasienAwalTahun) +
                        parseInt(jumlahPasienMasuk)
                    ) - 
                    (
                        parseInt(jumlahPasienKeluarHidup) +
                        parseInt(kurangDari48Jam) +
                        parseInt(event.target.value)
                    )
                )
                break
            case "jumlahLamaDirawat":
                if (event.target.value === '') {
                    event.target.value = 0
                    event.target.select(event.target.value)
                }
                setJumlahLamaDirawat(event.target.value)
                break
            case "jumlahPasienAkhirTahun":
                if (event.target.value === '') {
                    event.target.value = 0
                    event.target.select(event.target.value)
                }
                setJumlahPasienAkhirTahun(event.target.value)
                break
            case "jumlahHariPerawatan":
                if (event.target.value === '') {
                    event.target.value = 0
                    event.target.select(event.target.value)
                }
                setJumlahHariPerawatan(event.target.value)
                break
            case "kelasVVIP":
                if (event.target.value === '') {
                    event.target.value = 0
                    event.target.select(event.target.value)
                }
                setKelasVVIP(event.target.value)
                setJumlahHariPerawatan(
                    parseInt(event.target.value) +
                    parseInt(kelasVIP) +
                    parseInt(kelas1) +
                    parseInt(kelas2) +
                    parseInt(kelas3) +
                    parseInt(kelasKhusus)
                )
                break
            case "kelasVIP":
                if (event.target.value === '') {
                    event.target.value = 0
                    event.target.select(event.target.value)
                }
                setKelasVIP(event.target.value)
                setJumlahHariPerawatan(
                    parseInt(kelasVVIP) +
                    parseInt(event.target.value) +
                    parseInt(kelas1) +
                    parseInt(kelas2) +
                    parseInt(kelas3) +
                    parseInt(kelasKhusus)
                )
                break
            case "kelas1":
                if (event.target.value === '') {
                    event.target.value = 0
                    event.target.select(event.target.value)
                }
                setKelas1(event.target.value)
                setJumlahHariPerawatan(
                    parseInt(kelasVVIP) +
                    parseInt(kelasVIP) +
                    parseInt(event.target.value) +
                    parseInt(kelas2) +
                    parseInt(kelas3) +
                    parseInt(kelasKhusus)
                )
                break
            case "kelas2":
                if (event.target.value === '') {
                    event.target.value = 0
                    event.target.select(event.target.value)
                }
                setKelas2(event.target.value)
                setJumlahHariPerawatan(
                    parseInt(kelasVVIP) +
                    parseInt(kelasVIP) +
                    parseInt(kelas1) +
                    parseInt(event.target.value) +
                    parseInt(kelas3) +
                    parseInt(kelasKhusus)
                )
                break
            case "kelas3":
                if (event.target.value === '') {
                    event.target.value = 0
                    event.target.select(event.target.value)
                }
                setKelas3(event.target.value)
                setJumlahHariPerawatan(
                    parseInt(kelasVVIP) +
                    parseInt(kelasVIP) +
                    parseInt(kelas1) +
                    parseInt(kelas2) +
                    parseInt(event.target.value) +
                    parseInt(kelasKhusus)
                )
                break
            case "kelasKhusus":
                if (event.target.value === '') {
                    event.target.value = 0
                    event.target.select(event.target.value)
                }
                setKelasKhusus(event.target.value)
                setJumlahHariPerawatan(
                    parseInt(kelasVVIP) +
                    parseInt(kelasVIP) +
                    parseInt(kelas1) +
                    parseInt(kelas2) +
                    parseInt(kelas3) +
                    parseInt(event.target.value)
                )
                break
            default:
                break
        }
    }

    const Simpan = async (e) => {
        e.preventDefault()
        setButtonStatus(true)
        if (jumlahPasienAkhirTahun < 0) {
            toast(`jumlah pasien akhir tahun tidak boleh lebih kecil dari 0`, {
                position: toast.POSITION.TOP_RIGHT
            })
            setButtonStatus(false)
            return
        }
        try {
            const data = {
                "jumlahPasienAwalTahun": jumlahPasienAwalTahun,
                "jumlahPasienMasuk": jumlahPasienMasuk,
                "pasienKeluarHidup": jumlahPasienKeluarHidup,
                "kurangDari48Jam": kurangDari48Jam,
                "lebihDariAtauSamaDengan48Jam": lebihDariAtauSamaDengan48Jam,
                "jumlahLamaDirawat": jumlahLamaDirawat,
                "jumlahPasienAkhirTahun": jumlahPasienAkhirTahun,
                "jumlahHariPerawatan": jumlahHariPerawatan,
                "kelasVVIP": kelasVVIP,
                "kelasVIP": kelasVIP,
                "kelas1": kelas1,
                "kelas2": kelas2,
                "kelas3": kelas3,
                "kelasKhusus": kelasKhusus
            }

            const customConfig = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }

            await axiosJWT.patch('/apisirs/rltigatitiksatu/' + id, data, customConfig)
            
            toast('Data Berhasil Diubah', {
                position: toast.POSITION.TOP_RIGHT
            })
            setTimeout(() => {
                navigate('/rl31')
            }, 1000);
        } catch (error) {
            console.log(error)
            toast('Data Gagal Disimpan', {
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
                </div>
                <div className="row mt-3">
                    <div className="col-md-12">
                        <Link to={`/rl31/`} className='btn btn-info' style={{fontSize:"18px", backgroundColor: "#779D9E", color: "#FFFFFF"}}>
                            {/* <IoArrowBack size={30} style={{color:"gray",cursor: "pointer"}}/> */}
                            &lt;
                        </Link>
                        <span style={{color: "gray"}}>Kembali RL 3.1 Rawat Inap</span>
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
                                <tr>
                                    <td>
                                        <input type='text' name='id' className="form-control" value="1" disabled={true}/>
                                    </td>
                                    <td>
                                        <input type="text" name="jenisPelayanan" className="form-control" value={jenisPelayanan} disabled={true} />
                                    </td>
                                    <td>
                                        <input type="number" name="jumlahPasienAwalTahun" className="form-control" value={jumlahPasienAwalTahun} 
                                            onFocus={handleFocus} onChange={event => changeHandler(event)} disabled={false} min={0} onPaste={preventPasteNegative}
                                            onKeyPress={preventMinus}/>
                                    </td>
                                    <td>
                                        <input type="number" name="jumlahPasienMasuk" className="form-control" value={jumlahPasienMasuk} 
                                            onFocus={handleFocus} onChange={event => changeHandler(event)} disabled={false} min={0} onPaste={preventPasteNegative}
                                            onKeyPress={preventMinus}/>
                                    </td>
                                    <td>
                                        <input type="number" name="jumlahPasienKeluarHidup" className="form-control" value={jumlahPasienKeluarHidup} 
                                            onFocus={handleFocus} onChange={event => changeHandler(event)} disabled={false} min={0} onPaste={preventPasteNegative}
                                            onKeyPress={preventMinus}/>
                                    </td>
                                    <td><input type="number" name="kurangDari48Jam" className="form-control" value={kurangDari48Jam} 
                                        onFocus={handleFocus} onChange={event => changeHandler(event)} disabled={false} min={0} onPaste={preventPasteNegative}
                                        onKeyPress={preventMinus}/>
                                    </td>
                                    <td><input type="number" name="lebihDariAtauSamaDengan48Jam" className="form-control" value={lebihDariAtauSamaDengan48Jam} 
                                        onFocus={handleFocus} onChange={event => changeHandler(event)} disabled={false} min={0} onPaste={preventPasteNegative}
                                        onKeyPress={preventMinus}/>
                                    </td>
                                    <td><input type="number" name="jumlahLamaDirawat" className="form-control" value={jumlahLamaDirawat} 
                                        onFocus={handleFocus} onChange={event => changeHandler(event)} disabled={false} min={0} onPaste={preventPasteNegative}
                                        onKeyPress={preventMinus}/>
                                    </td>
                                    <td><input type="number" name="jumlahPasienAkhirTahun" className="form-control" value={jumlahPasienAkhirTahun} 
                                        onFocus={handleFocus} onChange={event => changeHandler(event)} disabled={true} min={0} onPaste={preventPasteNegative}
                                        onKeyPress={preventMinus}/>
                                    </td>
                                    <td><input type="number" name="jumlahHariPerawatan" className="form-control" value={jumlahHariPerawatan} 
                                        onFocus={handleFocus} onChange={event => changeHandler(event)} disabled={true} min={0} onPaste={preventPasteNegative}
                                        onKeyPress={preventMinus}/>
                                    </td>
                                    <td><input type="number" name="kelasVVIP" className="form-control" value={kelasVVIP} 
                                        onFocus={handleFocus} onChange={event => changeHandler(event)} disabled={false} min={0} onPaste={preventPasteNegative}
                                        onKeyPress={preventMinus}/>
                                    </td>
                                    <td><input type="number" name="kelasVIP" className="form-control" value={kelasVIP} 
                                        onFocus={handleFocus} onChange={event => changeHandler(event)} disabled={false} min={0} onPaste={preventPasteNegative}
                                        onKeyPress={preventMinus}/>
                                    </td>
                                    <td><input type="number" name="kelas1" className="form-control" value={kelas1} 
                                        onFocus={handleFocus} onChange={event => changeHandler(event)} disabled={false} min={0} onPaste={preventPasteNegative}
                                        onKeyPress={preventMinus}/>
                                    </td>
                                    <td><input type="number" name="kelas2" className="form-control" value={kelas2} 
                                        onFocus={handleFocus} onChange={event => changeHandler(event)} disabled={false} min={0} onPaste={preventPasteNegative}
                                        onKeyPress={preventMinus}/>
                                    </td>
                                    <td><input type="number" name="kelas3" className="form-control" value={kelas3} 
                                        onFocus={handleFocus} onChange={event => changeHandler(event)} disabled={false} min={0} onPaste={preventPasteNegative}
                                        onKeyPress={preventMinus}/>
                                    </td>
                                    <td><input type="number" name="kelasKhusus" className="form-control" value={kelasKhusus} 
                                        onFocus={handleFocus} onChange={event => changeHandler(event)} disabled={false} min={0} onPaste={preventPasteNegative}
                                        onKeyPress={preventMinus}/>
                                    </td>
                                </tr>
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

export default FormUbahRL31