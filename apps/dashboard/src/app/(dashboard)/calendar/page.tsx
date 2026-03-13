'use client';

import React, { useState } from 'react';

interface Event {
  id: number;
  name: string;
  customer: string;
  date: string;
  startTime: string;
  endTime: string;
  guests: number;
  menu: string;
  status: 'Confirmed' | 'Pending';
  color: string;
}

interface KitchenTask {
  task: string;
  startTime: string;
  endTime: string;
  staff: number;
  status: 'pending' | 'in-progress' | 'completed';
}

interface KitchenTimeline {
  id: number;
  eventName: string;
  date: string;
  eventId: number;
  tasks: KitchenTask[];
}

interface StaffRole {
  role: string;
  count: number;
  assigned: number;
  status: 'confirmed' | 'pending';
}

interface StaffAllocation {
  eventId: number;
  eventName: string;
  date: string;
  staffNeeded: StaffRole[];
}

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 2, 13));
  const [viewType, setViewType] = useState<'month' | 'week' | 'day'>('month');
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showAddTimeline, setShowAddTimeline] = useState(false);
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  const [editingTimeline, setEditingTimeline] = useState<number | null>(null);
  const [editingStaff, setEditingStaff] = useState<number | null>(null);

  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      name: 'Wedding Reception',
      customer: 'Emma Wilson',
      date: '2026-04-05',
      startTime: '18:00',
      endTime: '23:00',
      guests: 80,
      menu: 'Wedding Package',
      status: 'Confirmed',
      color: '#3b82f6',
    },
    {
      id: 2,
      name: 'Corporate Event',
      customer: 'Tech Startup Inc',
      date: '2026-03-25',
      startTime: '12:00',
      endTime: '14:30',
      guests: 120,
      menu: 'Corporate Lunch',
      status: 'Confirmed',
      color: '#f59e0b',
    },
    {
      id: 3,
      name: 'Birthday Party',
      customer: 'Sarah Johnson',
      date: '2026-03-20',
      startTime: '19:00',
      endTime: '22:00',
      guests: 40,
      menu: 'Birthday Package',
      status: 'Pending',
      color: '#ec4899',
    },
  ]);

  const [kitchenTimelines, setKitchenTimelines] = useState<KitchenTimeline[]>([
    {
      id: 1,
      eventName: 'Wedding Reception',
      date: '2026-04-05',
      eventId: 1,
      tasks: [
        { task: 'Prep ingredients', startTime: '08:00', endTime: '10:00', staff: 3, status: 'pending' },
        { task: 'Cook appetizers', startTime: '10:00', endTime: '14:00', staff: 5, status: 'pending' },
        { task: 'Prepare main dishes', startTime: '12:00', endTime: '16:00', staff: 6, status: 'pending' },
      ],
    },
  ]);

  const [staffAllocations, setStaffAllocations] = useState<StaffAllocation[]>([
    {
      eventId: 1,
      eventName: 'Wedding Reception',
      date: '2026-04-05',
      staffNeeded: [
        { role: 'Head Chef', count: 1, assigned: 1, status: 'confirmed' },
        { role: 'Sous Chef', count: 2, assigned: 2, status: 'confirmed' },
        { role: 'Line Cook', count: 4, assigned: 3, status: 'pending' },
        { role: 'Server', count: 6, assigned: 6, status: 'confirmed' },
      ],
    },
  ]);

  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    name: '',
    customer: '',
    date: '',
    startTime: '',
    endTime: '',
    guests: 0,
    menu: '',
    status: 'Pending',
    color: '#667eea',
  });

  const [newTask, setNewTask] = useState<Partial<KitchenTask>>({
    task: '',
    startTime: '',
    endTime: '',
    staff: 0,
    status: 'pending',
  });

  const [newStaff, setNewStaff] = useState<Partial<StaffRole>>({
    role: '',
    count: 0,
    assigned: 0,
    status: 'pending',
  });

  const colors = ['#3b82f6', '#f59e0b', '#ec4899', '#10b981', '#8b5cf6', '#ef4444', '#06b6d4'];

  // Helper functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getEventsForDate = (date: string) => {
    return events.filter((e) => e.date === date);
  };

  // Event handlers
  const handleAddEvent = () => {
    if (newEvent.name && newEvent.customer && newEvent.date) {
      const event: Event = {
        id: Math.max(...events.map((e) => e.id), 0) + 1,
        name: newEvent.name,
        customer: newEvent.customer,
        date: newEvent.date,
        startTime: newEvent.startTime || '00:00',
        endTime: newEvent.endTime || '00:00',
        guests: newEvent.guests || 0,
        menu: newEvent.menu || '',
        status: newEvent.status as 'Confirmed' | 'Pending',
        color: newEvent.color || '#667eea',
      };
      setEvents([...events, event]);
      setNewEvent({
        name: '',
        customer: '',
        date: '',
        startTime: '',
        endTime: '',
        guests: 0,
        menu: '',
        status: 'Pending',
        color: '#667eea',
      });
      setShowAddEvent(false);
    }
  };

  const handleDeleteEvent = (id: number) => {
    setEvents(events.filter((e) => e.id !== id));
    setKitchenTimelines(kitchenTimelines.filter((k) => k.eventId !== id));
    setStaffAllocations(staffAllocations.filter((s) => s.eventId !== id));
  };

  const handleAddTask = () => {
    if (selectedEvent && newTask.task && newTask.startTime && newTask.endTime) {
      const timeline = kitchenTimelines.find((k) => k.eventId === selectedEvent);
      if (timeline) {
        const updatedTimelines = kitchenTimelines.map((k) =>
          k.eventId === selectedEvent
            ? {
                ...k,
                tasks: [
                  ...k.tasks,
                  {
                    task: newTask.task || '',
                    startTime: newTask.startTime || '',
                    endTime: newTask.endTime || '',
                    staff: newTask.staff || 1,
                    status: newTask.status as 'pending' | 'in-progress' | 'completed',
                  },
                ],
              }
            : k
        );
        setKitchenTimelines(updatedTimelines);
      } else {
        const event = events.find((e) => e.id === selectedEvent);
        if (event) {
          setKitchenTimelines([
            ...kitchenTimelines,
            {
              id: Math.max(...kitchenTimelines.map((k) => k.id), 0) + 1,
              eventName: event.name,
              date: event.date,
              eventId: event.id,
              tasks: [
                {
                  task: newTask.task,
                  startTime: newTask.startTime,
                  endTime: newTask.endTime,
                  staff: newTask.staff || 1,
                  status: newTask.status as 'pending' | 'in-progress' | 'completed',
                },
              ],
            },
          ]);
        }
      }
      setNewTask({
        task: '',
        startTime: '',
        endTime: '',
        staff: 0,
        status: 'pending',
      });
      setShowAddTimeline(false);
    }
  };

  const handleDeleteTask = (eventId: number, taskIndex: number) => {
    const updatedTimelines = kitchenTimelines.map((k) =>
      k.eventId === eventId
        ? {
            ...k,
            tasks: k.tasks.filter((_, idx) => idx !== taskIndex),
          }
        : k
    );
    setKitchenTimelines(updatedTimelines);
  };

  const handleUpdateTaskStatus = (eventId: number, taskIndex: number, status: 'pending' | 'in-progress' | 'completed') => {
    const updatedTimelines = kitchenTimelines.map((k) =>
      k.eventId === eventId
        ? {
            ...k,
            tasks: k.tasks.map((task, idx) =>
              idx === taskIndex ? { ...task, status } : task
            ),
          }
        : k
    );
    setKitchenTimelines(updatedTimelines);
  };

  const handleAddStaffRole = () => {
    if (selectedEvent && newStaff.role && newStaff.count) {
      const allocation = staffAllocations.find((s) => s.eventId === selectedEvent);
      if (allocation) {
        const updatedAllocations = staffAllocations.map((s) =>
          s.eventId === selectedEvent
            ? {
                ...s,
                staffNeeded: [
                  ...s.staffNeeded,
                  {
                    role: newStaff.role || '',
                    count: newStaff.count || 0,
                    assigned: newStaff.assigned || 0,
                    status: newStaff.status as 'confirmed' | 'pending',
                  },
                ],
              }
            : s
        );
        setStaffAllocations(updatedAllocations.map(allocation => ({
                  ...allocation,
                  staffNeeded: allocation.staffNeeded.map(staff => ({
                    ...staff,
                    role: staff.role || '',
                    status: staff.status as 'confirmed' | 'pending',
                  })),
                })));
      } else {
        const event = events.find((e) => e.id === selectedEvent);
        if (event) {
          setStaffAllocations([
            ...staffAllocations,
            {
              eventId: event.id,
              eventName: event.name,
              date: event.date,
              staffNeeded: [
                {
                  role: newStaff.role,
                  count: newStaff.count,
                  assigned: newStaff.assigned || 0,
                  status: newStaff.status as 'confirmed' | 'pending',
                },
              ],
            },
          ]);
        }
      }
      setNewStaff({
        role: '',
        count: 0,
        assigned: 0,
        status: 'pending',
      });
      setShowAddStaff(false);
    }
  };

  const handleDeleteStaffRole = (eventId: number, roleIndex: number) => {
    const updatedAllocations = staffAllocations.map((s) =>
      s.eventId === eventId
        ? {
            ...s,
            staffNeeded: s.staffNeeded.filter((_, idx) => idx !== roleIndex),
          }
        : s
    );
    setStaffAllocations(updatedAllocations.map(allocation => ({
      ...allocation,
      staffNeeded: allocation.staffNeeded.map(staff => ({
        ...staff,
        status: staff.status as 'confirmed' | 'pending',
      })),
    })));
  };

  const handleUpdateStaffAssigned = (eventId: number, roleIndex: number, assigned: number) => {
    const updatedAllocations = staffAllocations.map((s) =>
      s.eventId === eventId
        ? {
            ...s,
            staffNeeded: s.staffNeeded.map((staff, idx) =>
              idx === roleIndex
                ? {
                    ...staff,
                    assigned,
                    status: assigned === staff.count ? 'confirmed' : 'pending',
                  }
                : staff
            ),
          }
        : s
    );
    setStaffAllocations(updatedAllocations.map(allocation => ({
      ...allocation,
      staffNeeded: allocation.staffNeeded.map(staff => ({
        ...staff,
        status: staff.status as 'pending' | 'confirmed',
      })),
    })));
  };

  const monthDays = getDaysInMonth(selectedDate);
  const firstDay = getFirstDayOfMonth(selectedDate);
  const monthYear = selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '0.75rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #f0f0f0',
  };

  const modalStyle = {
    backgroundColor: 'white',
    borderRadius: '0.75rem',
    boxShadow: '0 20px 25px rgba(0, 0, 0, 0.15)',
    border: '1px solid #e5e7eb',
    padding: '1.5rem',
    maxWidth: '500px',
    width: '90%',
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', margin: 0, marginBottom: '0.5rem' }}>
            📅 Calendar
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
            Manage upcoming events, kitchen timeline, and staff allocation
          </p>
        </div>
        <button
          onClick={() => setShowAddEvent(true)}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            border: 'none',
            backgroundColor: '#667eea',
            color: 'white',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.875rem',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#5568d3')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#667eea')}
        >
          + Add Event
        </button>
      </div>

      {/* View Toggle */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
        {(['month', 'week', 'day'] as const).map((view) => (
          <button
            key={view}
            onClick={() => setViewType(view)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: 'none',
              backgroundColor: viewType === view ? '#667eea' : '#f3f4f6',
              color: viewType === view ? 'white' : '#6b7280',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '0.875rem',
              transition: 'all 0.2s ease',
              textTransform: 'capitalize',
            }}
            onMouseEnter={(e) => {
              if (viewType !== view) {
                e.currentTarget.style.backgroundColor = '#e5e7eb';
              }
            }}
            onMouseLeave={(e) => {
              if (viewType !== view) {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
              }
            }}
          >
            {view}
          </button>
        ))}
      </div>

      {/* Calendar Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Month Calendar */}
        <div style={cardStyle}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                {monthYear}
              </h2>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1))}
                  style={{
                    padding: '0.5rem',
                    borderRadius: '0.375rem',
                    border: '1px solid #e5e7eb',
                    backgroundColor: '#f9fafb',
                    cursor: 'pointer',
                  }}
                >
                  ←
                </button>
                <button
                  onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1))}
                  style={{
                    padding: '0.5rem',
                    borderRadius: '0.375rem',
                    border: '1px solid #e5e7eb',
                    backgroundColor: '#f9fafb',
                    cursor: 'pointer',
                  }}
                >
                  →
                </button>
              </div>
            </div>
          </div>

          <div style={{ padding: '1.5rem' }}>
            {/* Day headers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div
                  key={day}
                  style={{
                    textAlign: 'center',
                    fontWeight: '600',
                    color: '#6b7280',
                    fontSize: '0.75rem',
                    padding: '0.5rem',
                  }}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Days */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem' }}>
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} style={{ aspectRatio: '1', backgroundColor: '#f9fafb', borderRadius: '0.375rem' }} />
              ))}

              {Array.from({ length: monthDays }).map((_, i) => {
                const day = i + 1;
                const dateStr = `2026-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const dayEvents = getEventsForDate(dateStr);
                const isToday = day === 13 && selectedDate.getMonth() === 2 && selectedDate.getFullYear() === 2026;

                return (
                  <div
                    key={day}
                    onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day))}
                    style={{
                      aspectRatio: '1',
                      backgroundColor: isToday ? '#dbeafe' : '#f9fafb',
                      border: isToday ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      padding: '0.5rem',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f0f0f0';
                      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = isToday ? '#dbeafe' : '#f9fafb';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <span
                      style={{
                        fontWeight: isToday ? 'bold' : '600',
                        fontSize: '0.875rem',
                        color: isToday ? '#3b82f6' : '#1f2937',
                        marginBottom: '0.25rem',
                      }}
                    >
                      {day}
                    </span>
                    {dayEvents.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', overflow: 'hidden' }}>
                        {dayEvents.slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            style={{
                              backgroundColor: event.color,
                              color: 'white',
                              borderRadius: '0.25rem',
                              padding: '0.25rem 0.5rem',
                              fontSize: '0.65rem',
                              fontWeight: '500',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {event.name}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div style={{ fontSize: '0.65rem', color: '#6b7280', fontWeight: '500' }}>
                            +{dayEvents.length - 2} more
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Upcoming Events Sidebar */}
        <div style={cardStyle}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #f0f0f0' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
              📌 Upcoming Events
            </h2>
          </div>
          <div style={{ padding: '1.5rem', maxHeight: '500px', overflowY: 'auto' }}>
            {events.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {events.map((event) => (
                  <div
                    key={event.id}
                    style={{
                      padding: '1rem',
                      backgroundColor: '#f9fafb',
                      borderRadius: '0.5rem',
                      borderLeft: `4px solid ${event.color}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onClick={() => setSelectedEvent(event.id)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                      <div>
                        <p style={{ margin: 0, fontWeight: '600', color: '#1f2937', fontSize: '0.875rem' }}>
                          {event.name}
                        </p>
                        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: '#6b7280' }}>
                          {event.customer}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteEvent(event.id);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ef4444',
                          cursor: 'pointer',
                          fontSize: '1.25rem',
                          padding: 0,
                        }}
                      >
                        ✕
                      </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.75rem', color: '#6b7280' }}>
                      <span>📅 {event.date}</span>
                      <span>⏰ {event.startTime} - {event.endTime}</span>
                      <span>👥 {event.guests} guests</span>
                      <span>🍽️ {event.menu}</span>
                    </div>
                    <span
                      style={{
                        display: 'inline-block',
                        marginTop: '0.5rem',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '0.375rem',
                        fontSize: '0.7rem',
                        fontWeight: '600',
                        backgroundColor: event.status === 'Confirmed' ? '#d1fae5' : '#fef3c7',
                        color: event.status === 'Confirmed' ? '#065f46' : '#92400e',
                      }}
                    >
                      {event.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#6b7280', textAlign: 'center', margin: 0 }}>No events scheduled</p>
            )}
          </div>
        </div>
      </div>

      {/* Kitchen Preparation Timeline */}
      <div style={{ ...cardStyle, marginBottom: '2rem' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
            🍳 Kitchen Preparation Timeline
          </h2>
          <button
            onClick={() => {
              if (selectedEvent) {
                setShowAddTimeline(true);
              } else {
                alert('Please select an event first');
              }
            }}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              border: 'none',
              backgroundColor: '#667eea',
              color: 'white',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '0.75rem',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#5568d3')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#667eea')}
          >
            + Add Task
          </button>
        </div>
        <div style={{ padding: '1.5rem' }}>
          {kitchenTimelines.length > 0 ? (
            kitchenTimelines.map((timeline) => (
              <div key={timeline.id} style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem', margin: 0 }}>
                  {timeline.eventName} - {timeline.date}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {timeline.tasks.map((task, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ minWidth: '150px' }}>
                        <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: '500', color: '#1f2937' }}>
                          {task.task}
                        </p>
                        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: '#6b7280' }}>
                          {task.startTime} - {task.endTime}
                        </p>
                      </div>

                      {/* Timeline Bar */}
                      <div style={{ flex: 1, height: '32px', backgroundColor: '#e5e7eb', borderRadius: '0.375rem', overflow: 'hidden' }}>
                        <div
                          style={{
                            height: '100%',
                            backgroundColor: '#667eea',
                            width: `${((parseInt(task.endTime) - parseInt(task.startTime)) / 16) * 100}%`,
                            borderRadius: '0.375rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '0.7rem',
                            fontWeight: '600',
                          }}
                        >
                          {`${parseInt(task.endTime) - parseInt(task.startTime)}h`}
                        </div>
                      </div>

                      <div style={{ minWidth: '140px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <select
                          value={task.status}
                          onChange={(e) =>
                            handleUpdateTaskStatus(
                              timeline.eventId,
                              idx,
                              e.target.value as 'pending' | 'in-progress' | 'completed'
                            )
                          }
                          style={{
                            padding: '0.25rem 0.5rem',
                            borderRadius: '0.375rem',
                            border: '1px solid #e5e7eb',
                            fontSize: '0.7rem',
                            backgroundColor:
                              task.status === 'completed'
                                ? '#d1fae5'
                                : task.status === 'in-progress'
                                  ? '#dbeafe'
                                  : '#fef3c7',
                            color:
                              task.status === 'completed'
                                ? '#065f46'
                                : task.status === 'in-progress'
                                  ? '#0c4a6e'
                                  : '#92400e',
                          }}
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                        <button
                          onClick={() => handleDeleteTask(timeline.eventId, idx)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer',
                            fontSize: '1rem',
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {timeline.id < kitchenTimelines.length && (
                  <div style={{ borderBottom: '1px solid #e5e7eb', marginTop: '2rem' }} />
                )}
              </div>
            ))
          ) : (
            <p style={{ color: '#6b7280', textAlign: 'center', margin: 0 }}>No kitchen timelines created yet</p>
          )}
        </div>
      </div>

      {/* Staff Allocation */}
      <div style={cardStyle}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
            👥 Staff Allocation
          </h2>
          <button
            onClick={() => {
              if (selectedEvent) {
                setShowAddStaff(true);
              } else {
                alert('Please select an event first');
              }
            }}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              border: 'none',
              backgroundColor: '#667eea',
              color: 'white',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '0.75rem',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#5568d3')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#667eea')}
          >
            + Add Staff Role
          </button>
        </div>
        <div style={{ padding: '1.5rem' }}>
          {staffAllocations.length > 0 ? (
            staffAllocations.map((allocation) => (
              <div key={allocation.eventId} style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem', margin: 0 }}>
                  {allocation.eventName} - {allocation.date}
                </h3>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', fontSize: '0.875rem', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                        <th style={{ textAlign: 'left', padding: '0.75rem', color: '#6b7280', fontWeight: '600' }}>
                          Role
                        </th>
                        <th style={{ textAlign: 'center', padding: '0.75rem', color: '#6b7280', fontWeight: '600' }}>
                          Needed
                        </th>
                        <th style={{ textAlign: 'center', padding: '0.75rem', color: '#6b7280', fontWeight: '600' }}>
                          Assigned
                        </th>
                        <th style={{ textAlign: 'center', padding: '0.75rem', color: '#6b7280', fontWeight: '600' }}>
                          Status
                        </th>
                        <th style={{ textAlign: 'center', padding: '0.75rem', color: '#6b7280', fontWeight: '600' }}>
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {allocation.staffNeeded.map((staff, idx) => {
                        const filled = staff.assigned === staff.count;
                        return (
                          <tr key={idx} style={{ borderBottom: '1px solid #f0f0f0' }}>
                            <td style={{ padding: '0.75rem', color: '#1f2937', fontWeight: '500' }}>
                              {staff.role}
                            </td>
                            <td style={{ padding: '0.75rem', textAlign: 'center', color: '#667eea', fontWeight: '600' }}>
                              {staff.count}
                            </td>
                            <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                              <input
                                type="number"
                                value={staff.assigned}
                                onChange={(e) =>
                                  handleUpdateStaffAssigned(
                                    allocation.eventId,
                                    idx,
                                    parseInt(e.target.value)
                                  )
                                }
                                min="0"
                                max={staff.count}
                                style={{
                                  width: '50px',
                                  padding: '0.375rem',
                                  borderRadius: '0.375rem',
                                  border: '1px solid #e5e7eb',
                                  textAlign: 'center',
                                }}
                              />
                            </td>
                            <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                              <span
                                style={{
                                  padding: '0.25rem 0.75rem',
                                  borderRadius: '0.375rem',
                                  fontSize: '0.7rem',
                                  fontWeight: '600',
                                  backgroundColor: filled ? '#d1fae5' : '#fef3c7',
                                  color: filled ? '#065f46' : '#92400e',
                                }}
                              >
                                {staff.status}
                              </span>
                            </td>
                            <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                              <button
                                onClick={() => handleDeleteStaffRole(allocation.eventId, idx)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: '#ef4444',
                                  cursor: 'pointer',
                                  fontSize: '1rem',
                                }}
                              >
                                ✕
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {allocation.eventId !== staffAllocations[staffAllocations.length - 1].eventId && (
                  <div style={{ borderBottom: '1px solid #e5e7eb', marginTop: '2rem' }} />
                )}
              </div>
            ))
          ) : (
            <p style={{ color: '#6b7280', textAlign: 'center', margin: 0 }}>No staff allocations created yet</p>
          )}
        </div>
      </div>

      {/* Modals */}
      {showAddEvent && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
          }}
          onClick={() => setShowAddEvent(false)}
        >
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', margin: 0, marginBottom: '1rem' }}>
              Add New Event
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1f2937' }}>
                  Event Name
                </label>
                <input
                  type="text"
                  value={newEvent.name || ''}
                  onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    boxSizing: 'border-box',
                  }}
                  placeholder="e.g., Wedding Reception"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1f2937' }}>
                  Customer Name
                </label>
                <input
                  type="text"
                  value={newEvent.customer || ''}
                  onChange={(e) => setNewEvent({ ...newEvent, customer: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    boxSizing: 'border-box',
                  }}
                  placeholder="e.g., John Doe"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1f2937' }}>
                    Date
                  </label>
                  <input
                    type="date"
                    value={newEvent.date || ''}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1f2937' }}>
                    Guests
                  </label>
                  <input
                    type="number"
                    value={newEvent.guests || 0}
                    onChange={(e) => setNewEvent({ ...newEvent, guests: parseInt(e.target.value) })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      boxSizing: 'border-box',
                    }}
                    placeholder="50"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1f2937' }}>
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={newEvent.startTime || ''}
                    onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1f2937' }}>
                    End Time
                  </label>
                  <input
                    type="time"
                    value={newEvent.endTime || ''}
                    onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1f2937' }}>
                  Menu
                </label>
                <input
                  type="text"
                  value={newEvent.menu || ''}
                  onChange={(e) => setNewEvent({ ...newEvent, menu: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    boxSizing: 'border-box',
                  }}
                  placeholder="e.g., Wedding Package"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1f2937' }}>
                    Color
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setNewEvent({ ...newEvent, color })}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '0.5rem',
                          backgroundColor: color,
                          border: newEvent.color === color ? '3px solid #1f2937' : '1px solid #e5e7eb',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1f2937' }}>
                    Status
                  </label>
                  <select
                    value={newEvent.status || 'Pending'}
                    onChange={(e) => setNewEvent({ ...newEvent, status: e.target.value as 'Confirmed' | 'Pending' })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                    }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button
                  onClick={handleAddEvent}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    backgroundColor: '#667eea',
                    color: 'white',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#5568d3')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#667eea')}
                >
                  Create Event
                </button>
                <button
                  onClick={() => setShowAddEvent(false)}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #e5e7eb',
                    backgroundColor: 'white',
                    color: '#1f2937',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Kitchen Task Modal */}
      {showAddTimeline && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
          }}
          onClick={() => setShowAddTimeline(false)}
        >
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', margin: 0, marginBottom: '1rem' }}>
              Add Kitchen Task
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1f2937' }}>
                  Task Name
                </label>
                <input
                  type="text"
                  value={newTask.task || ''}
                  onChange={(e) => setNewTask({ ...newTask, task: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    boxSizing: 'border-box',
                  }}
                  placeholder="e.g., Prep ingredients"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1f2937' }}>
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={newTask.startTime || ''}
                    onChange={(e) => setNewTask({ ...newTask, startTime: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1f2937' }}>
                    End Time
                  </label>
                  <input
                    type="time"
                    value={newTask.endTime || ''}
                    onChange={(e) => setNewTask({ ...newTask, endTime: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1f2937' }}>
                  Staff Required
                </label>
                <input
                  type="number"
                  value={newTask.staff || 0}
                  onChange={(e) => setNewTask({ ...newTask, staff: parseInt(e.target.value) })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    boxSizing: 'border-box',
                  }}
                  placeholder="5"
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button
                  onClick={handleAddTask}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    backgroundColor: '#667eea',
                    color: 'white',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#5568d3')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#667eea')}
                >
                  Add Task
                </button>
                <button
                  onClick={() => setShowAddTimeline(false)}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #e5e7eb',
                    backgroundColor: 'white',
                    color: '#1f2937',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Staff Role Modal */}
      {showAddStaff && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
          }}
          onClick={() => setShowAddStaff(false)}
        >
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', margin: 0, marginBottom: '1rem' }}>
              Add Staff Role
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1f2937' }}>
                  Role
                </label>
                <input
                  type="text"
                  value={newStaff.role || ''}
                  onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    boxSizing: 'border-box',
                  }}
                  placeholder="e.g., Head Chef"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1f2937' }}>
                    Required Count
                  </label>
                  <input
                    type="number"
                    value={newStaff.count || 0}
                    onChange={(e) => setNewStaff({ ...newStaff, count: parseInt(e.target.value) })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      boxSizing: 'border-box',
                    }}
                    placeholder="5"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1f2937' }}>
                    Already Assigned
                  </label>
                  <input
                    type="number"
                    value={newStaff.assigned || 0}
                    onChange={(e) => setNewStaff({ ...newStaff, assigned: parseInt(e.target.value) })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      boxSizing: 'border-box',
                    }}
                    placeholder="0"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button
                  onClick={handleAddStaffRole}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    backgroundColor: '#667eea',
                    color: 'white',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#5568d3')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#667eea')}
                >
                  Add Staff Role
                </button>
                <button
                  onClick={() => setShowAddStaff(false)}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #e5e7eb',
                    backgroundColor: 'white',
                    color: '#1f2937',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}