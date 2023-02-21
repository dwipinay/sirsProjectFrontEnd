import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import style from "./FormTambahRL39.module.css";
import { useNavigate, Link } from "react-router-dom";
import { HiSaveAs } from "react-icons/hi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import Table from "react-bootstrap/Table";
import { RiDeleteBin5Fill, RiEdit2Fill } from "react-icons/ri";
import { AiFillFileAdd } from "react-icons/ai";
import Spinner from "react-bootstrap/Spinner";

const RL39 = () => {
  const [namaRS, setNamaRS] = useState("");
  const [alamatRS, setAlamatRS] = useState("");
  const [namaPropinsi, setNamaPropinsi] = useState("");
  const [namaKabKota, setNamaKabKota] = useState("");
  const [tahun, setTahun] = useState(new Date().getFullYear() - 1);
  const [dataRL, setDataRL] = useState([]);
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const navigate = useNavigate();
  const [spinner, setSpinner] = useState(false);

  useEffect(() => {
    refreshToken();
    CariLastYear(new Date().getFullYear() - 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get("/apisirs/token");
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setExpire(decoded.exp);
      getDataRS(decoded.rsId);
    } catch (error) {
      if (error.response) {
        navigate("/");
      }
    }
  };

  const axiosJWT = axios.create();
  axiosJWT.interceptors.request.use(
    async (config) => {
      const currentDate = new Date();
      if (expire * 1000 < currentDate.getTime()) {
        const response = await axios.get("/apisirs/token");
        config.headers.Authorization = `Bearer ${response.data.accessToken}`;
        setToken(response.data.accessToken);
        const decoded = jwt_decode(response.data.accessToken);
        setExpire(decoded.exp);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const changeHandlerSingle = (event) => {
    setTahun(event.target.value);
  };

  // const changeHandler = (event, index) => {
  //   let newDataRL = [...dataRL];
  //   const name = event.target.name;
  //   if (name === "check") {
  //     if (event.target.checked === true) {
  //       newDataRL[index].disabledInput = false;
  //     } else if (event.target.checked === false) {
  //       newDataRL[index].disabledInput = true;
  //     }
  //     newDataRL[index].checked = event.target.checked;
  //   } else if (name === "Jumlah") {
  //     newDataRL[index].Jumlah = event.target.value;
  //   }
  //   setDataRL(newDataRL);
  // };

  const getDataRS = async (id) => {
    try {
      const response = await axiosJWT.get("/apisirs/rumahsakit/" + id, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNamaRS(response.data.data[0].nama);
      setAlamatRS(response.data.data[0].alamat);
      setNamaPropinsi(response.data.data[0].propinsi.nama);
      setNamaKabKota(response.data.data[0].kabKota.nama);
    } catch (error) {}
  };

  const Cari = async (e) => {
    e.preventDefault();
    try {
      setSpinner(true);
      const customConfig = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        params: {
          tahun: tahun,
        },
      };

      const results = await axiosJWT.get("/apisirs/rltigatitiksembilan", customConfig);

      const rlTigaTitikSembilanDetails = results.data.data.map((value) => {
        return value.rl_tiga_titik_sembilan_details;
      });

      let dataRLTigaTitiksembilanDetails = [];
      rlTigaTitikSembilanDetails.forEach((element) => {
        element.forEach((value) => {
          dataRLTigaTitiksembilanDetails.push(value);
        });
      });

      let sortedProducts = dataRLTigaTitiksembilanDetails.sort((p1, p2) =>
        p1.jenis_tindakan_id > p2.jenis_tindakan_id ? 1 : -1
      );

      let groups = [];
      sortedProducts.reduce(function (res, value) {
        if (!res[value.group_jenis_tindakan.group_jenis_tindakan_header_id]) {
          res[value.group_jenis_tindakan.group_jenis_tindakan_header_id] = {
            groupId: value.group_jenis_tindakan.group_jenis_tindakan_header_id,
            groupNama:
              value.group_jenis_tindakan.group_jenis_tindakan_header.nama,
            jumlah: 0,
          };
          groups.push(
            res[value.group_jenis_tindakan.group_jenis_tindakan_header_id]
          );
        }
        res[value.group_jenis_tindakan.group_jenis_tindakan_header_id].jumlah +=
          value.jumlah;
        return res;
      }, {});

      let data = [];
      groups.forEach((element) => {
        if (element.groupId != null) {
          const filterData = sortedProducts.filter((value, index) => {
            return (
              value.group_jenis_tindakan.group_jenis_tindakan_header_id ===
              element.groupId
            );
          });
          data.push({
            groupNo: element.groupId,
            groupNama: element.groupNama,
            details: filterData,
            subTotal: element.jumlah,
          });
        }
      });
      setDataRL(data);
      setSpinner(false)
    } catch (error) {
      toast("Get Data Error", {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.log(error);
    }
  };

  const CariLastYear = async (tahun) => {
    setSpinner(true)
    try {
      const customConfig = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        params: {
          tahun: tahun,
        },
      };
      const results = await axiosJWT.get("/apisirs/rltigatitiksembilan", customConfig);
      const rlTigaTitikSembilanDetails = results.data.data.map((value) => {
        return value.rl_tiga_titik_sembilan_details;
      });

      let dataRLTigaTitiksembilanDetails = [];
      rlTigaTitikSembilanDetails.forEach((element) => {
        element.forEach((value) => {
          dataRLTigaTitiksembilanDetails.push(value);
        });
      });

      let sortedProducts = dataRLTigaTitiksembilanDetails.sort(
        (p1, p2) => (p1.jenis_tindakan_id > p2.jenis_tindakan_id ? 1 : -1)
        // p1.id > p2.id ? 1 : p1.jenis_tindakan_id < p2.jenis_tindakan_id ? -1 : 0
      );

      let groups = [];

      sortedProducts.reduce(function (res, value) {
        if (!res[value.group_jenis_tindakan.group_jenis_tindakan_header_id]) {
          res[value.group_jenis_tindakan.group_jenis_tindakan_header_id] = {
            groupId: value.group_jenis_tindakan.group_jenis_tindakan_header_id,
            groupNama:
              value.group_jenis_tindakan.group_jenis_tindakan_header.nama,
            jumlah: 0,
          };
          groups.push(
            res[value.group_jenis_tindakan.group_jenis_tindakan_header_id]
          );
        }
        res[value.group_jenis_tindakan.group_jenis_tindakan_header_id].jumlah +=
          value.jumlah;
        return res;
      }, {});

      let data = [];
      groups.forEach((element) => {
        if (element.groupId != null) {
          const filterData = sortedProducts.filter((value, index) => {
            return (
              value.group_jenis_tindakan.group_jenis_tindakan_header_id ===
              element.groupId
            );
          });
          data.push({
            groupNo: element.groupId,
            groupNama: element.groupNama,
            details: filterData,
            subTotal: element.jumlah,
          });
          // }
          // else if (element.groupId == null) {
          //   dataRLTigaTitiksembilanDetails.forEach((element) => {
          //     if (element.groupId == null) {
          //       data.push({
          //         groupNama: null,
          //         details: [
          //           {
          //             id: element.id,
          //             groupId: null,
          //             groupNama: null,
          //             nama: element.nama,
          //             nilai: element.nilai,
          //           },
          //         ],
          //         subTotal: null,
          //       });
          //     }
          //   });
        }
      });
      setDataRL(data);
      setSpinner(false)
    } catch (error) {
      console.log(error);
    }
  };

  const deleteDetailRL = async (id, tahun) => {
    try {
      const customConfig = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axiosJWT.delete("/apisirs/rltigatitiksembilan/" + id, customConfig);

      try {
        const customConfig = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          params: {
            tahun: tahun,
          },
        };
        const results = await axiosJWT.get(
          "/apisirs/rltigatitiksembilan",
          customConfig
        );
        const rlTigaTitikSembilanDetails = results.data.data.map((value) => {
          return value.rl_tiga_titik_sembilan_details;
        });

        let dataRLTigaTitiksembilanDetails = [];
        rlTigaTitikSembilanDetails.forEach((element) => {
          element.forEach((value) => {
            dataRLTigaTitiksembilanDetails.push(value);
          });
        });

        let sortedProducts = dataRLTigaTitiksembilanDetails.sort((p1, p2) =>
          p1.jenis_tindakan_id > p2.jenis_tindakan_id ? 1 : -1
        );

        let groups = [];

        sortedProducts.reduce(function (res, value) {
          if (!res[value.group_jenis_tindakan.group_jenis_tindakan_header_id]) {
            res[value.group_jenis_tindakan.group_jenis_tindakan_header_id] = {
              groupId:
                value.group_jenis_tindakan.group_jenis_tindakan_header_id,
              groupNama:
                value.group_jenis_tindakan.group_jenis_tindakan_header.nama,
              jumlah: 0,
            };
            groups.push(
              res[value.group_jenis_tindakan.group_jenis_tindakan_header_id]
            );
          }
          res[
            value.group_jenis_tindakan.group_jenis_tindakan_header_id
          ].jumlah += value.jumlah;
          return res;
        }, {});

        let data = [];
        groups.forEach((element) => {
          if (element.groupId != null) {
            const filterData = sortedProducts.filter((value, index) => {
              return (
                value.group_jenis_tindakan.group_jenis_tindakan_header_id ===
                element.groupId
              );
            });
            data.push({
              groupNama: element.groupNama,
              details: filterData,
              subTotal: element.jumlah,
            });
          }
        });
        setDataRL(data);
      } catch (error) {
        console.log(error);
      }

      toast("Data Berhasil Dihapus", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      console.log(error);
      toast("Data Gagal Dihapus", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const Delete = (id) => {
    confirmAlert({
      title: "Konfirmasi Penghapusan",
      message: "Apakah Anda Yakin ?",
      buttons: [
        {
          label: "Ya",
          onClick: () => {
            deleteDetailRL(id, tahun);
          },
        },
        {
          label: "Tidak",
        },
      ],
    });
  };

  return (
    <div className="container" style={{ marginTop: "70px" }}>
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title h5">Profile Fasyankes</h5>
              <div
                className="form-floating"
                style={{ width: "100%", display: "inline-block" }}
              >
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  value={namaRS}
                  disabled={true}
                />
                <label htmlFor="floatingInput">Nama</label>
              </div>
              <div
                className="form-floating"
                style={{ width: "100%", display: "inline-block" }}
              >
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  value={alamatRS}
                  disabled={true}
                />
                <label htmlFor="floatingInput">Alamat</label>
              </div>
              <div
                className="form-floating"
                style={{ width: "50%", display: "inline-block" }}
              >
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  value={namaPropinsi}
                  disabled={true}
                />
                <label htmlFor="floatingInput">Provinsi </label>
              </div>
              <div
                className="form-floating"
                style={{ width: "50%", display: "inline-block" }}
              >
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  value={namaKabKota}
                  disabled={true}
                />
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
                <div
                  className="form-floating"
                  style={{ width: "100%", display: "inline-block" }}
                >
                  <input
                    name="tahun"
                    type="text"
                    className="form-control"
                    id="floatingInput"
                    placeholder="Tahun"
                    value={tahun}
                    onChange={(e) => changeHandlerSingle(e)}
                  />
                  <label htmlFor="floatingInput">Tahun</label>
                </div>
                <div className="mt-3 mb-3">
                  <button type="submit" className="btn btn-outline-success">
                    <HiSaveAs /> Cari
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-3 mb-3">
        <div className="col-md-12">
          <Link
            to={`/rl39/tambah/`}
            style={{ textDecoration: "none", display: "flex" }}
          >
            <AiFillFileAdd
              size={30}
              style={{ color: "gray", cursor: "pointer" }}
            />
            <span style={{ color: "gray" }}>RL 3.9 Rehab Medik Catatan</span>
          </Link>
            <div className="container" style={{ textAlign: "center" }}>
              {/* <h5>test</h5> */}
              {spinner && <Spinner animation="grow" variant="success"></Spinner>}
              {spinner && <Spinner animation="grow" variant="success"></Spinner>}
              {spinner && <Spinner animation="grow" variant="success"></Spinner>}
              {spinner && <Spinner animation="grow" variant="success"></Spinner>}
              {spinner && <Spinner animation="grow" variant="success"></Spinner>}
              {spinner && <Spinner animation="grow" variant="success"></Spinner>}
            </div>
          <Table
            className={style.rlTable}
            responsive
            bordered
            // style={{ width: "100%" }}
          >
            <thead>
              <tr>
                <th style={{ width: "5%" }}>No.</th>
                <th style={{ width: "5%" }}></th>
                <th style={{ width: "40%" }}>Jenis Tindakan</th>
                <th style={{ width: "50%" }}>Jumlah</th>
              </tr>
            </thead>
            <tbody>
              {
                // eslint-disable-next-line
                dataRL.map((value, index) => {
                  if (value.groupNama != null) {
                    return (
                      <React.Fragment key={index}>
                        <tr>
                          {value.groupNo === 9 &&
                            <td>-</td>
                          }
                          {value.groupNo !== 9 &&
                            <td>{value.groupNo}</td>
                          }
                          
                          <td></td>
                          <td style={{ textAlign: "left" }}>
                            {value.groupNama}
                          </td>
                          <td>{value.subTotal}</td>
                        </tr>
                        {value.details.map((value2, index2) => {
                          return (
                            <tr key={index2}>
                              <td>{value2.group_jenis_tindakan.no}</td>
                              <td>
                                <ToastContainer />
                                <RiDeleteBin5Fill
                                  size={20}
                                  onClick={(e) =>
                                    Delete(value2.id, value2.tahun)
                                  }
                                  style={{
                                    color: "gray",
                                    cursor: "pointer",
                                    marginRight: "5px",
                                  }}
                                />
                                {value2.group_jenis_tindakan.id !== 41 &&
                                  <Link to={`/rl39/ubah/${value2.id}`}>
                                    <RiEdit2Fill
                                      size={20}
                                      style={{ color: "gray", cursor: "pointer" }}
                                    />
                                  </Link>
                                }
                                
                              </td>
                              <td style={{ textAlign: "left" }}>
                                &emsp;{value2.group_jenis_tindakan.nama}
                              </td>
                              <td>{value2.jumlah}</td>
                            </tr>
                          );
                        })}
                      </React.Fragment>
                    );
                  } else if (value.groupNama == null) {
                    return (
                      <React.Fragment key={index}>
                        <tr>
                          <td style={{ textAlign: "left" }}>
                            {value.details[0].nama}
                          </td>
                          <td>{value.details[0].nilai}</td>
                        </tr>
                      </React.Fragment>
                    );
                  }
                })
              }
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default RL39;
