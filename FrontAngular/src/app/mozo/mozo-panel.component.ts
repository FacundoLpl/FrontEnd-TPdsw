import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { AuthService } from "../core/services/auth.service"
import { MozoService } from "../services/mozo.service"
import { PedidoService } from "../services/pedido.service"


interface Mesa {
  id: string
  numero: number
  capacidad: number
  estado: "Libre" | "Ocupada" | "Reservada" | "Limpieza"
  pedidoActual?: string
  tiempoOcupada?: number
  horaReserva?: string
  mozo: string
}

interface PedidoItem {
  nombre: string
  cantidad: number
  precio: number
  notas?: string
}

interface PedidoMozo {
  id: string
  mesa?: number
  cliente: string
  items: PedidoItem[]
  total: number
  estado: "Pendiente" | "Preparando" | "Listo" | "Servido" | "Pagado"
  tipo: "Presencial" | "Online" | "Delivery"
  hora: string
  tiempo: number
  notas?: string
  prioridad?: "normal" | "alta"
}

interface EstadisticasMozo {
  mesasAsignadas: number
  mesasOcupadas: number
  pedidosPendientes: number
  ventasHoy: number
}

@Component({
  selector: "app-mozo-panel",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./mozo-panel.component.html",
  styleUrls: ["./mozo-panel.component.css"],
})
export class MozoPanelComponent implements OnInit {
  activeSection = "pedidos"
  selectedPedido: PedidoMozo | null = null
  selectedMesa: Mesa | null = null
  showDetallePedido = false
  showNuevoPedido = false

  // Datos del mozo
  mozoInfo = {
    nombre: "Juan Pérez",
    turno: "Noche",
    mesasAsignadas: [1, 2, 3, 4, 5, 6],
  }

  // Estadísticas
  estadisticas: EstadisticasMozo = {
    mesasAsignadas: 6,
    mesasOcupadas: 0,
    pedidosPendientes: 0,
    ventasHoy: 0
  }

  // Mesas mejoradas
  mesas: Mesa[] = [
    { id: "1", numero: 1, capacidad: 4, estado: "Libre", mozo: "Juan Pérez" },
    { id: "2", numero: 2, capacidad: 2, estado: "Ocupada", pedidoActual: "PED001", tiempoOcupada: 45, mozo: "Juan Pérez" },
    { id: "3", numero: 3, capacidad: 6, estado: "Reservada", horaReserva: "20:00", mozo: "Juan Pérez" },
    { id: "4", numero: 4, capacidad: 4, estado: "Ocupada", pedidoActual: "PED002", tiempoOcupada: 20, mozo: "Juan Pérez" },
    { id: "5", numero: 5, capacidad: 2, estado: "Libre", mozo: "Juan Pérez" },
    { id: "6", numero: 6, capacidad: 8, estado: "Ocupada", pedidoActual: "PED003", tiempoOcupada: 60, mozo: "Juan Pérez" },
  ]

  // Pedidos mejorados
  pedidos: PedidoMozo[] = [
    {
      id: "PED001",
      mesa: 2,
      cliente: "María García",
      items: [
        { nombre: "Hamburguesa Clásica", cantidad: 2, precio: 15.99 },
        { nombre: "Papas Fritas", cantidad: 1, precio: 8.5 },
        { nombre: "Coca Cola", cantidad: 2, precio: 3.5 },
      ],
      total: 47.48,
      estado: "Pendiente",
      tipo: "Presencial",
      hora: "19:30",
      tiempo: 15,
      notas: "Sin cebolla en la hamburguesa",
    },
    {
      id: "PED002",
      mesa: 4,
      cliente: "Carlos López",
      items: [
        { nombre: "Pizza Margherita", cantidad: 1, precio: 18.99 },
        { nombre: "Ensalada César", cantidad: 1, precio: 12.5 },
      ],
      total: 31.49,
      estado: "Preparando",
      tipo: "Presencial",
      hora: "19:45",
      tiempo: 5,
    },
    {
      id: "PED003",
      mesa: 6,
      cliente: "Ana Martínez",
      items: [
        { nombre: "Pasta Carbonara", cantidad: 2, precio: 16.99 },
        { nombre: "Vino Tinto", cantidad: 1, precio: 25.0 },
      ],
      total: 58.98,
      estado: "Listo",
      tipo: "Presencial",
      hora: "19:15",
      tiempo: 30,
      prioridad: "alta"
    },
  ]

  constructor(
    private authService: AuthService,
    private mozoService: MozoService,
    private pedidoService: PedidoService
  ) {}

  ngOnInit(): void {
    if (!this.authService.isMozo()) {
      this.authService.redirectByRole()
    }
    this.calcularEstadisticas()
    this.iniciarActualizacionTiempo()
  }

  calcularEstadisticas(): void {
    this.estadisticas = {
      mesasAsignadas: this.mesas.length,
      mesasOcupadas: this.mesas.filter(m => m.estado === 'Ocupada').length,
      pedidosPendientes: this.pedidos.filter(p => p.estado === 'Pendiente').length,
      ventasHoy: this.pedidos.reduce((sum, p) => sum + p.total, 0)
    }
  }

  iniciarActualizacionTiempo(): void {
    setInterval(() => {
      this.pedidos.forEach(pedido => {
        pedido.tiempo += 1
      })
      this.mesas.forEach(mesa => {
        if (mesa.tiempoOcupada) {
          mesa.tiempoOcupada += 1
        }
      })
    }, 60000) // Actualizar cada minuto
  }

  setActiveSection(section: string): void {
    this.activeSection = section
  }

  cambiarEstadoMesa(mesa: Mesa, nuevoEstado: Mesa["estado"]): void {
    const estadoAnterior = mesa.estado
    mesa.estado = nuevoEstado
    
    // Lógica adicional según el cambio de estado
    if (nuevoEstado === 'Ocupada' && estadoAnterior === 'Libre') {
      mesa.tiempoOcupada = 0
    } else if (nuevoEstado === 'Libre') {
      mesa.tiempoOcupada = undefined
      mesa.pedidoActual = undefined
    }
    
    this.calcularEstadisticas()
    console.log(`Mesa ${mesa.numero} cambiada de ${estadoAnterior} a ${nuevoEstado}`)
  }

  cambiarEstadoPedido(pedido: PedidoMozo, nuevoEstado: PedidoMozo["estado"]): void {
    const estadoAnterior = pedido.estado
    pedido.estado = nuevoEstado
    
    // Resetear tiempo si se marca como servido
    if (nuevoEstado === 'Servido') {
      pedido.tiempo = 0
    }
    
    this.calcularEstadisticas()
    console.log(`Pedido ${pedido.id} cambiado de ${estadoAnterior} a ${nuevoEstado}`)
  }

  obtenerSiguienteEstado(estadoActual: string): string | null {
    const estados = ["Pendiente", "Preparando", "Listo", "Servido", "Pagado"]
    const currentIndex = estados.indexOf(estadoActual)
    return currentIndex < estados.length - 1 ? estados[currentIndex + 1] : null
  }

  obtenerLabelSiguienteEstado(estadoActual: string): string | null {
    const nextEstado = this.obtenerSiguienteEstado(estadoActual)
    if (!nextEstado) return null

    const labels: { [key: string]: string } = {
      "Preparando": "Enviar a Cocina",
      "Listo": "Marcar Listo",
      "Servido": "Marcar Servido",
      "Pagado": "Marcar Pagado",
    }

    return labels[nextEstado] || nextEstado
  }

  avanzarEstadoPedido(pedido: PedidoMozo): void {
    const siguienteEstado = this.obtenerSiguienteEstado(pedido.estado)
    if (siguienteEstado) {
      this.cambiarEstadoPedido(pedido, siguienteEstado as PedidoMozo["estado"])
    }
  }

  tomarPedido(mesa: Mesa): void {
    this.selectedMesa = mesa
    this.showNuevoPedido = true
    this.setActiveSection('nuevo-pedido')
  }

  verDetallePedido(pedido: PedidoMozo): void {
    this.selectedPedido = pedido
    this.showDetallePedido = true
  }

  cerrarDetallePedido(): void {
    this.showDetallePedido = false
    this.selectedPedido = null
  }

  cerrarNuevoPedido(): void {
    this.showNuevoPedido = false
    this.selectedMesa = null
  }

  obtenerClaseEstadoPedido(estado: string): string {
    const clases: { [key: string]: string } = {
      'Pendiente': 'estado-pendiente',
      'Preparando': 'estado-preparando',
      'Listo': 'estado-listo',
      'Servido': 'estado-servido',
      'Pagado': 'estado-pagado'
    }
    return clases[estado] || ''
  }

  obtenerClaseEstadoMesa(estado: string): string {
    const clases: { [key: string]: string } = {
      'Libre': 'mesa-libre',
      'Ocupada': 'mesa-ocupada',
      'Reservada': 'mesa-reservada',
      'Limpieza': 'mesa-limpieza'
    }
    return clases[estado] || ''
  }

  logout(): void {
    this.authService.logout()
  }
}