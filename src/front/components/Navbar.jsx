import { Link } from "react-router-dom";

export const Navbar = () => {

	return (
		<nav className="navbar navbar-light bg-light">
			<Link
				to={"/"}
			>
				<h1 style={{ margin: 0 }}>Pick4Fun</h1>
			</Link>

			<div style={{ display: "flex", gap: 8 }}>
				<Link
					to={"/registro"}
				>
					Registrarse
				</Link>
				<Link
					to={"/login"}
				>
					Iniciar sesión
				</Link>
				<Link
					to={"/events/new"}
				>
					Crear evento
				</Link>
			</div>
		</nav>
	);
};