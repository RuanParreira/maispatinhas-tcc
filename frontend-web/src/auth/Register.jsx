import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [municipalityId, setMunicipalityId] = useState("");
  const [municipalities, setMunicipalities] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/api/municipalities").then((res) => setMunicipalities(res.data));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});

    try {
      await api.get("/sanctum/csrf-cookie");
      await api.post("/api/register", {
        name,
        email,
        phone,
        password,
        password_confirmation: passwordConfirmation,
        municipality_id: municipalityId,
      });
      navigate("/adoptions");
    } catch (err) {
      setErrors(err.response?.data?.errors ?? { email: ["Erro ao registrar."] });
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Nome</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {errors.name && <p>{errors.name[0]}</p>}
      </div>

      <div>
        <label htmlFor="email">E-mail</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <p>{errors.email[0]}</p>}
      </div>

      <div>
        <label htmlFor="phone">Telefone</label>
        <input
          id="phone"
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        {errors.phone && <p>{errors.phone[0]}</p>}
      </div>

      <div>
        <label htmlFor="municipality_id">Município</label>
        <select
          id="municipality_id"
          value={municipalityId}
          onChange={(e) => setMunicipalityId(e.target.value)}
        >
          <option value="">Selecione...</option>
          {municipalities.map((m) => (
            <option key={m.ibge_code} value={m.ibge_code}>
              {m.name} - {m.state}
            </option>
          ))}
        </select>
        {errors.municipality_id && <p>{errors.municipality_id[0]}</p>}
      </div>

      <div>
        <label htmlFor="password">Senha</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && <p>{errors.password[0]}</p>}
      </div>

      <div>
        <label htmlFor="password_confirmation">Confirmar senha</label>
        <input
          id="password_confirmation"
          type="password"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
        />
      </div>

      <button type="submit">Registrar</button>
    </form>
  );
}
