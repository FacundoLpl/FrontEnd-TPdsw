import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface PedidoItem {
  nombre: string;
  cantidad: number;
  precio: number;
  notas?: string;
}

export interface Pedido {
  id: string;
  mesa?: number;
  cliente: string;
  items: PedidoItem[];
  total: number;
  estado: 'Pendiente' | 'Preparando' | 'Listo' | 'Servido' | 'Pagado';
  tipo: 'Presencial' | 'Online' | 'Delivery';
  hora: string;
  tiempo: number;
  notas?: string;
  prioridad?: 'normal' | 'alta';
  mozoId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private pedidosSubject = new BehaviorSubject<Pedido[]>([
    {
      id: 'PED001',
      mesa: 2,
      cliente: 'María García',
      items: [
        { nombre: 'Hamburguesa Clásica', cantidad: 2, precio: 15.99 },
        { nombre: 'Papas Fritas', cantidad: 1, precio: 8.5 },
        { nombre: 'Coca Cola', cantidad: 2, precio: 3.5 },
      ],
      total: 47.48,
      estado: 'Pendiente',
      tipo: 'Presencial',
      hora: '19:30',
      tiempo: 15,
      notas: 'Sin cebolla en la hamburguesa',
      mozoId: '1'
    },
    {
      id: 'PED002',
      mesa: 4,
      cliente: 'Carlos López',
      items: [
        { nombre: 'Pizza Margherita', cantidad: 1, precio: 18.99 },
        { nombre: 'Ensalada César', cantidad: 1, precio: 12.5 },
      ],
      total: 31.49,
      estado: 'Preparando',
      tipo: 'Presencial',
      hora: '19:45',
      tiempo: 5,
      mozoId: '1'
    },
    {
      id: 'PED003',
      mesa: 6,
      cliente: 'Ana Martínez',
      items: [
        { nombre: 'Pasta Carbonara', cantidad: 2, precio: 16.99 },
        { nombre: 'Vino Tinto', cantidad: 1, precio: 25.0 },
      ],
      total: 58.98,
      estado: 'Listo',
      tipo: 'Presencial',
      hora: '19:15',
      tiempo: 30,
      prioridad: 'alta',
      mozoId: '1'
    },
  ]);

  constructor() { }

  getPedidos(): Observable<Pedido[]> {
    return this.pedidosSubject.asObservable();
  }

  getPedidosPorMozo(mozoId: string): Observable<Pedido[]> {
    return new Observable(observer => {
      this.pedidosSubject.subscribe(pedidos => {
        const pedidosFiltrados = pedidos.filter(p => p.mozoId === mozoId);
        observer.next(pedidosFiltrados);
      });
    });
  }

  crearPedido(pedido: Omit<Pedido, 'id' | 'tiempo'>): void {
    const pedidos = this.pedidosSubject.value;
    const nuevoPedido: Pedido = {
      ...pedido,
      id: `PED${String(pedidos.length + 1).padStart(3, '0')}`,
      tiempo: 0
    };
    
    this.pedidosSubject.next([...pedidos, nuevoPedido]);
  }

  actualizarEstadoPedido(pedidoId: string, nuevoEstado: Pedido['estado']): void {
    const pedidos = this.pedidosSubject.value;
    const pedidoIndex = pedidos.findIndex(p => p.id === pedidoId);
    
    if (pedidoIndex !== -1) {
      const pedidosActualizados = [...pedidos];
      pedidosActualizados[pedidoIndex] = {
        ...pedidosActualizados[pedidoIndex],
        estado: nuevoEstado
      };
      
      this.pedidosSubject.next(pedidosActualizados);
    }
  }

  eliminarPedido(pedidoId: string): void {
    const pedidos = this.pedidosSubject.value;
    const pedidosFiltrados = pedidos.filter(p => p.id !== pedidoId);
    this.pedidosSubject.next(pedidosFiltrados);
  }

  obtenerPedidoPorId(pedidoId: string): Pedido | undefined {
    return this.pedidosSubject.value.find(p => p.id === pedidoId);
  }

  calcularTotalVentas(): number {
    return this.pedidosSubject.value
      .filter(p => p.estado === 'Pagado')
      .reduce((total, pedido) => total + pedido.total, 0);
  }

  obtenerPedidosPorEstado(estado: Pedido['estado']): Pedido[] {
    return this.pedidosSubject.value.filter(p => p.estado === estado);
  }
}